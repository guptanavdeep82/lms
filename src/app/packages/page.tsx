"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgePercent, BookOpenCheck, CheckCircle2, Crown, Layers3, Loader2, MonitorPlay, Trophy } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { RazorpayCheckoutButton } from "@/components/payments/RazorpayCheckoutButton";
import { fetchPackages, formatInr, packageEffectivePrice, packageIncludeLabel, type PackageItem } from "@/lib/packages";
import { fetchStudentPurchases } from "@/lib/checkout";
import { getStudentSession } from "@/lib/student-auth";

const styles = `
.packages-page{min-height:100vh;background:#f7f3df;color:#050808;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.packages-hero{position:relative;overflow:hidden;background:#050808;color:#fff;padding:70px 5% 56px}
.packages-hero:before{content:"";position:absolute;inset:0;background:linear-gradient(115deg,rgba(5,8,8,.98) 0%,rgba(5,8,8,.9) 46%,rgba(214,169,0,.88) 100%),radial-gradient(circle at 76% 16%,rgba(255,210,31,.42),transparent 28%);pointer-events:none}
.packages-hero:after{content:"";position:absolute;right:-120px;bottom:-180px;width:460px;height:460px;border:1px solid rgba(255,210,31,.24);border-radius:50%;box-shadow:inset 0 0 0 42px rgba(255,210,31,.05)}
.packages-hero-inner{position:relative;z-index:1;max-width:1220px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(340px,.82fr);gap:38px;align-items:center}
.packages-kicker{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,210,31,.34);border-radius:999px;background:rgba(255,210,31,.08);color:#ffd21f;padding:8px 14px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.16em}
.packages-hero h1{margin:18px 0 14px;max-width:760px;font-size:clamp(34px,4.2vw,60px);line-height:.95;font-weight:950;letter-spacing:0}
.packages-hero p{max-width:660px;color:rgba(255,255,255,.74);font-size:16px;line-height:1.8}
.hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}
.hero-actions a{display:inline-flex;height:46px;align-items:center;justify-content:center;border-radius:8px;padding:0 18px;font-size:13px;font-weight:950;text-decoration:none}
.hero-primary{background:#ffd21f;color:#050808}.hero-secondary{border:1px solid rgba(255,210,31,.38);color:#ffd21f;background:rgba(255,255,255,.05)}
.package-spotlight{position:relative;border:1px solid rgba(255,210,31,.3);border-radius:18px;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.06));padding:18px;box-shadow:0 28px 80px rgba(0,0,0,.28);backdrop-filter:blur(12px)}
.spotlight-card{border-radius:14px;background:#fff;color:#050808;padding:22px;box-shadow:0 18px 40px rgba(0,0,0,.22)}
.spotlight-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
.spotlight-badge{display:inline-flex;align-items:center;gap:7px;border-radius:999px;background:#050808;color:#ffd21f;padding:7px 11px;font-size:11px;font-weight:950;text-transform:uppercase}
.package-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:16px}
.summary-card{border:1px solid #eadcae;border-radius:10px;background:#fffdf3;padding:14px}.summary-card strong{display:block;color:#050808;font-size:24px;font-weight:950}.summary-card span{font-size:12px;color:#716850;font-weight:800}
.packages-wrap{max-width:1220px;margin:0 auto;padding:42px 5% 72px}
.section-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:22px}
.section-head h2{margin:0;font-size:28px;line-height:1;font-weight:950}.section-head p{margin:8px 0 0;color:#716850;font-size:14px;line-height:1.65}
.packages-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
.package-card{position:relative;display:flex;flex-direction:column;min-height:468px;border:1px solid #dfcf97;border-radius:18px;background:#fff;box-shadow:0 18px 44px rgba(5,8,8,.08);overflow:hidden;transition:transform .22s ease,box-shadow .22s ease}
.package-card:hover{transform:translateY(-7px);box-shadow:0 28px 62px rgba(5,8,8,.15)}
.package-card.featured{border-color:#d6a900;box-shadow:0 26px 70px rgba(159,115,0,.18)}
.package-ribbon{position:absolute;right:14px;top:14px;z-index:2;border-radius:999px;background:#ffd21f;color:#050808;padding:7px 10px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em}
.package-top{position:relative;color:#fff;padding:22px;min-height:190px;overflow:hidden}
.package-top:before{content:"";position:absolute;right:-42px;top:-42px;width:150px;height:150px;border-radius:50%;background:rgba(255,210,31,.18)}
.package-card.gold .package-top{background:linear-gradient(135deg,#050808 0%,#171711 58%,#d6a900 100%)}
.package-card.black .package-top{background:linear-gradient(135deg,#050808 0%,#1f2522 100%)}
.package-card.cream .package-top{background:linear-gradient(135deg,#ffffff 0%,#fff4bd 100%);color:#050808}
.package-type{position:relative;display:inline-flex;border-radius:999px;background:rgba(255,210,31,.96);color:#050808;padding:6px 11px;font-size:11px;font-weight:950}
.package-card.cream .package-type{background:#050808;color:#ffd21f}
.package-top h2{position:relative;margin:18px 0 10px;font-size:21px;line-height:1.08;font-weight:950}
.package-top p{position:relative;margin:0;color:rgba(255,255,255,.76);font-size:13px;line-height:1.6}
.package-card.cream .package-top p{color:#625d4d}
.package-body{display:flex;flex:1;flex-direction:column;padding:19px}
.include-list{display:grid;gap:10px;margin-bottom:18px}
.include-list div{display:flex;align-items:center;gap:9px;color:#2d2b22;font-size:13px;font-weight:850}
.include-list svg{color:#c79a00;flex:0 0 auto}
.package-price{margin-top:auto;border-top:1px solid #eee2b6;padding-top:16px}
.package-price strong{font-size:30px;font-weight:950}.package-price del{margin-left:8px;color:#8f8a77;font-size:14px}
.package-note{margin-top:5px;color:#7b725c;font-size:11px;font-weight:800}
.package-btn-wrap{margin-top:14px}
.why-strip{margin-top:42px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.why-item{border:1px solid #dfcf97;border-radius:16px;background:#fffdf3;padding:20px;box-shadow:0 14px 30px rgba(5,8,8,.05)}
.why-item svg{color:#c79a00}.why-item h3{margin:12px 0 6px;font-size:16px;font-weight:950}.why-item p{margin:0;color:#6f6b5c;font-size:13px;line-height:1.55}
@media(max-width:1080px){.packages-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.packages-hero-inner{grid-template-columns:1fr}.why-strip{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:720px){.packages-hero{padding:46px 4%}.packages-wrap{padding-inline:4%}.packages-grid,.package-summary,.why-strip{grid-template-columns:1fr}.section-head{display:block}.package-card{min-height:auto}.package-top{min-height:auto}}
`;

const accents = ["gold", "black", "cream", "gold"] as const;
const tags = ["Most Value", "Test Series", "Self Study", "Live Batch"];

function cardAccent(index: number, featured?: boolean) {
  if (featured) return "gold";
  return accents[index % accents.length];
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasedIds, setPurchasedIds] = useState<number[]>([]);

  useEffect(() => {
    fetchPackages()
      .then(setPackages)
      .finally(() => setLoading(false));

    const session = getStudentSession();
    if (session?.email) {
      fetchStudentPurchases(session.email).then((items) => {
        setPurchasedIds(items.filter((item) => item.purchasable_type === "package").map((item) => item.purchasable_id));
      });
    }
  }, []);

  const featuredPackage = useMemo(
    () => packages.find((item) => item.is_featured) || packages[0] || null,
    [packages],
  );

  return (
    <main className="packages-page">
      <PublicHeader active="packages" />
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section className="packages-hero">
        <div className="packages-hero-inner">
          <div>
            <span className="packages-kicker">KR Logics Packages</span>
            <h1>Build Your Banking Exam Prep Stack</h1>
            <p>Pick single packs or combo bundles for mock tests, video courses, live classes and PDF material. Each package is designed for focused banking exam preparation.</p>
            <div className="hero-actions">
              <a className="hero-primary" href="#all-packages">Explore Packages</a>
              <a className="hero-secondary" href="/contact">Talk to Counsellor</a>
            </div>
          </div>
          {featuredPackage ? (
            <div className="package-spotlight">
              <div className="spotlight-card">
                <div className="spotlight-top">
                  <span className="spotlight-badge"><Crown size={15} /> Popular Combo</span>
                  <span className="spotlight-badge">{featuredPackage.validity_days} Days</span>
                </div>
                <h2>{featuredPackage.title}</h2>
                <p>{featuredPackage.short_description || "Complete preparation bundle for banking exams."}</p>
                <div className="package-summary">
                  <div className="summary-card"><strong>{packages.length}</strong><span>Live Packages</span></div>
                  <div className="summary-card"><strong>{featuredPackage.validity_days}</strong><span>Days Access</span></div>
                  <div className="summary-card"><strong>{featuredPackage.includes.length}</strong><span>Included Items</span></div>
                  <div className="summary-card"><strong>{formatInr(packageEffectivePrice(featuredPackage))}</strong><span>Offer Price</span></div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="packages-wrap" id="all-packages">
        <div className="section-head">
          <div>
            <h2>Preparation Packages</h2>
            <p>Choose a single product or combine multiple learning tools in one value plan.</p>
          </div>
          <BadgePercent size={34} color="#c79a00" />
        </div>

        {loading ? (
          <div className="grid min-h-[240px] place-items-center"><Loader2 className="animate-spin text-[#050808]" size={34} /></div>
        ) : (
          <div className="packages-grid">
            {packages.map((item, index) => {
              const price = packageEffectivePrice(item);
              const original = item.sale_price !== null && item.price > item.sale_price ? item.price : null;
              const accent = cardAccent(index, item.is_featured);
              const purchased = purchasedIds.includes(item.id);

              return (
                <article key={item.id} className={`package-card ${accent} ${item.is_featured ? "featured" : ""}`}>
                  <div className="package-ribbon">{item.is_featured ? "Featured" : tags[index % tags.length]}</div>
                  <div className="package-top">
                    <span className="package-type">{item.package_type === "combo" ? "Combo Package" : "Single Package"}</span>
                    <h2>{item.title}</h2>
                    <p>{item.short_description || "Focused banking exam preparation package."}</p>
                  </div>
                  <div className="package-body">
                    <div className="include-list">
                      {(item.includes?.length ? item.includes : ["courses", "mock_tests"]).map((include) => (
                        <div key={include}><CheckCircle2 size={17} /> {packageIncludeLabel(include)}</div>
                      ))}
                    </div>
                    <div className="package-price">
                      <strong>{formatInr(price)}</strong>
                      {original ? <del>{formatInr(original)}</del> : null}
                      <div className="package-note">{item.validity_days} days access included</div>
                      <div className="package-btn-wrap">
                        <RazorpayCheckoutButton
                          itemType="package"
                          itemId={item.id}
                          itemTitle={item.title}
                          price={price}
                          successRedirect="/student/courses"
                          label={price <= 0 ? "Enroll Free" : "Buy Package"}
                          purchasedLabel="Package Purchased"
                          alreadyPurchased={purchased}
                          onPurchased={() => setPurchasedIds((current) => [...current, item.id])}
                          className="flex h-11 w-full items-center justify-center rounded-[10px] bg-[#050808] text-sm font-extrabold text-[#ffd21f] transition hover:bg-[#ffd21f] hover:text-[#050808]"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
            {!packages.length && (
              <div style={{ gridColumn: "1 / -1", padding: "40px 0", textAlign: "center", color: "#716850", fontWeight: 700 }}>
                No published packages are available yet. Add packages from the admin panel.
              </div>
            )}
          </div>
        )}

        <div className="why-strip">
          <div className="why-item"><Layers3 size={26} /><h3>Combo Access</h3><p>Bundle video, mock tests, live classes and PDF content in one plan.</p></div>
          <div className="why-item"><MonitorPlay size={26} /><h3>Video Courses</h3><p>Structured recorded lessons with topic-wise preparation flow.</p></div>
          <div className="why-item"><BookOpenCheck size={26} /><h3>Smart Practice</h3><p>Practice, revise and analyze progress from a single student dashboard.</p></div>
          <div className="why-item"><Trophy size={26} /><h3>Exam Ready</h3><p>Built for IBPS, SBI, RBI and insurance banking aspirants.</p></div>
        </div>
      </section>
    </main>
  );
}
