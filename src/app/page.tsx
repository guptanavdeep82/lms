"use client";

import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { PublicHeader } from "@/components/PublicHeader";

const pageStyles = "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap');\n@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');\n*{margin:0;padding:0;box-sizing:border-box}\n:root{\n  --navy:#1B2E6B;--navy2:#243580;--navy3:#0F1E4A;\n  --gold:#F5C518;--gold2:#E8A800;--gold3:#FFF9E0;\n  --white:#FFFFFF;--gray:#6B7280;--light:#F8F9FC;\n  --light2:#EEF1F8;--border:#E5E8F0;--text:#1A1D2E;\n}\nhtml{scroll-behavior:smooth}\nbody{font-family:'Plus Jakarta Sans',sans-serif;background:var(--white);color:var(--text);overflow-x:hidden}\na{text-decoration:none;color:inherit}\n::-webkit-scrollbar{width:5px}\n::-webkit-scrollbar-thumb{background:var(--navy);border-radius:3px}\n\n/* ─── HEADER ─── */\nheader{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.97);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);padding:0 5%}\n.header-inner{display:flex;align-items:center;justify-content:space-between;height:72px;gap:20px}\n.logo-wrap{display:flex;align-items:center;gap:12px;flex-shrink:0}\n.logo-text-group{display:flex;flex-direction:column;line-height:1.2}\n.logo-text-group .brand{font-family:'Sora',sans-serif;font-size:20px;font-weight:800;color:var(--navy)}\n.logo-text-group .brand span{color:var(--gold2)}\n.logo-text-group .tagline{font-size:9px;color:var(--gray);letter-spacing:1.5px;text-transform:uppercase;font-weight:600}\nnav{display:flex;gap:24px;align-items:center;height:100%}\nnav a{font-size:13px;font-weight:600;color:var(--gray);transition:color .2s;padding:4px 0;border-bottom:2px solid transparent}\nnav a:hover{color:var(--navy);border-bottom-color:var(--gold)}\n\n.exam-menu-wrap{position:relative;display:flex;align-items:center;height:100%;line-height:1;align-self:center}\n.exam-menu-trigger{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--gray);transition:color .2s;padding:0;cursor:pointer;height:100%;line-height:1;white-space:nowrap;border-bottom:2px solid transparent}\n.exam-menu-trigger:hover{color:var(--navy);border-bottom-color:var(--gold2, var(--gold))}\n.exam-menu-trigger i{font-size:10px;transition:transform .2s}\n.exam-menu-wrap:hover .exam-menu-trigger i{transform:rotate(180deg)}\n.exam-mega{position:fixed;left:0;right:0;top:72px;background:#fff;border-top:1px solid var(--border);border-bottom:1px solid var(--border);box-shadow:0 18px 45px rgba(15,30,74,.12);padding:24px 30px;display:grid;grid-template-columns:230px 1fr;gap:32px;opacity:0;visibility:hidden;transform:translateY(10px);transition:all .22s ease;z-index:150}\n.exam-menu-wrap:hover .exam-mega{opacity:1;visibility:visible;transform:translateY(0)}\n.exam-cats{display:flex;flex-direction:column;gap:12px}\n.exam-cat{height:44px;border:1px solid var(--border);border-radius:7px;padding:0 12px;display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:600;color:var(--text);background:#fff;box-shadow:0 1px 0 rgba(0,0,0,.02)}\n.exam-cat.active{background:#FFF2F8;border-color:#F8DCEB;box-shadow:0 6px 18px rgba(216,90,120,.12)}\n.exam-cat i{font-size:12px;color:#1A1D2E}\n.exam-grid{display:grid;grid-template-columns:repeat(3,minmax(190px,1fr));gap:11px 30px}\n.exam-link{height:46px;border:1px solid #dfe3ea;border-radius:7px;background:#fff;display:flex;align-items:center;gap:10px;padding:0 12px;font-size:14px;font-weight:600;color:#121827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:all .18s ease}\n.exam-link:hover{border-color:var(--navy);box-shadow:0 8px 18px rgba(27,46,107,.12);transform:translateY(-1px);color:var(--navy)}\n.exam-icon{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:800;flex-shrink:0}\n.exam-icon.sky{background:#10AEEA}.exam-icon.blue{background:#4F6EF7}.exam-icon.gold{background:#F8C300;color:#421}.exam-icon.gray{background:#6D8FA8}.exam-icon.purple{background:#8B2C91}.exam-icon.red{background:#D35A5A}.exam-icon.soft{background:#E8F4FF;color:#1B6AA8;border:1px solid #BBD7F0}\n@media(max-width:960px){.exam-mega{top:72px;grid-template-columns:1fr;padding:18px}.exam-cats{display:none}.exam-grid{grid-template-columns:repeat(2,minmax(150px,1fr));gap:10px}.exam-link{font-size:12px}}\n@media(max-width:720px){.exam-menu-wrap{display:none}}\n\n.hdr-btns{display:flex;gap:10px;align-items:center;flex-shrink:0}\n.btn-ghost{padding:8px 20px;border:1.5px solid var(--navy);color:var(--navy);border-radius:8px;font-size:13px;font-weight:700;background:transparent;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s}\n.btn-ghost:hover{background:var(--navy);color:#fff}\n.btn-primary{padding:8px 22px;background:var(--navy);color:#fff;border-radius:8px;font-size:13px;font-weight:700;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s}\n.btn-primary:hover{background:var(--navy3);transform:translateY(-1px)}\n\n/* ─── HERO ─── */\n.hero{background:var(--light);padding:80px 5% 0;position:relative;overflow:hidden;min-height:92vh;display:flex;align-items:center}\n.hero-bg-circle{position:absolute;top:-100px;right:-100px;width:550px;height:550px;border-radius:50%;background:radial-gradient(circle,rgba(27,46,107,.06),transparent 70%);pointer-events:none}\n.hero-bg-gold{position:absolute;bottom:-60px;left:-60px;width:350px;height:350px;border-radius:50%;background:radial-gradient(circle,rgba(245,197,24,.07),transparent 70%);pointer-events:none}\n.hero-inner{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;width:100%}\n.hero-badge{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--border);border-radius:50px;padding:6px 16px;font-size:11px;font-weight:700;color:var(--navy);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:22px;box-shadow:0 2px 8px rgba(0,0,0,.06)}\n.hero-badge .dot{width:7px;height:7px;background:var(--gold);border-radius:50%;animation:blink 2s infinite}\n@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}\n.hero h1{font-family:'Sora',sans-serif;font-size:48px;font-weight:800;line-height:1.1;color:var(--navy);margin-bottom:18px;letter-spacing:-.5px}\n.hero h1 em{font-style:normal;color:var(--gold2)}\n.hero-p{font-size:16px;color:var(--gray);line-height:1.8;margin-bottom:28px;max-width:480px}\n.hero-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:30px}\n.chip{padding:5px 14px;background:#fff;border:1px solid var(--border);border-radius:50px;font-size:11px;font-weight:700;color:var(--navy)}\n.hero-btns{display:flex;gap:14px;flex-wrap:wrap}\n.hero-btn-main{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:var(--navy);color:#fff;border-radius:10px;font-weight:700;font-size:14px;transition:all .3s}\n.hero-btn-main:hover{background:var(--navy3);transform:translateY(-2px);box-shadow:0 10px 30px rgba(27,46,107,.3)}\n.hero-btn-sec{display:inline-flex;align-items:center;gap:8px;padding:14px 24px;background:#fff;border:2px solid var(--gold);color:var(--navy);border-radius:10px;font-weight:700;font-size:14px;transition:all .3s}\n.hero-btn-sec:hover{background:var(--gold3)}\n.hero-stats{display:flex;gap:32px;margin-top:42px;padding-top:30px;border-top:1px solid var(--border);flex-wrap:wrap}\n.hstat strong{display:block;font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:var(--navy)}\n.hstat small{font-size:11px;color:var(--gray);font-weight:600}\n/* hero cards */\n.hero-right{display:flex;flex-direction:column;gap:16px;padding-bottom:40px;z-index:2}\n.hero-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:20px 22px;box-shadow:0 4px 20px rgba(0,0,0,.05)}\n.hcard-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:var(--light2)}\n.hcard-row{display:flex;gap:12px;margin-top:14px}\n.hcard-half{flex:1;background:var(--light);border-radius:10px;padding:12px;text-align:center}\n.hcard-half strong{display:block;font-family:'Sora',sans-serif;font-size:20px;font-weight:800;color:var(--navy)}\n.hcard-half small{font-size:10px;color:var(--gray);font-weight:600;text-transform:uppercase;letter-spacing:.5px}\n.prog-bar{height:8px;background:var(--light2);border-radius:4px;overflow:hidden;margin:8px 0}\n.prog-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--navy),var(--navy2))}\n.mini-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px}\n.mini-card-dark{background:var(--navy);border-radius:16px;padding:18px}\n.mini-card-light{background:#fff;border:1px solid var(--border);border-radius:16px;padding:18px;box-shadow:0 4px 20px rgba(0,0,0,.05)}\n\n/* ─── SECTION COMMON ─── */\nsection{padding:80px 5%}\n.sec-eyebrow{display:inline-block;font-size:11px;font-weight:700;color:var(--gold2);letter-spacing:2px;text-transform:uppercase;background:var(--gold3);padding:4px 12px;border-radius:50px;margin-bottom:12px}\n.sec-title{font-family:'Sora',sans-serif;font-size:38px;font-weight:800;color:var(--navy);margin-bottom:12px;line-height:1.15;letter-spacing:-.3px}\n.sec-sub{font-size:15px;color:var(--gray);line-height:1.8;max-width:540px}\n.sec-center{text-align:center}.sec-center .sec-sub{margin:0 auto}\n.divider{height:1px;background:var(--border);margin:0 5%}\n\n/* ─── ABOUT ─── */\n.about-section{background:#fff}\n.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:center;margin-top:55px}\n.about-main-card{background:var(--navy);border-radius:20px;padding:36px;color:#fff;position:relative;overflow:hidden}\n.about-main-card::before{content:'';position:absolute;top:-50px;right:-50px;width:200px;height:200px;border-radius:50%;background:rgba(245,197,24,.08)}\n.about-inner{position:relative;z-index:1}\n.about-logo-row{display:flex;align-items:center;gap:14px;margin-bottom:18px}\n.about-stat-row{display:flex;gap:12px;margin-top:20px}\n.about-stat-box{flex:1;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:14px;text-align:center}\n.about-stat-box strong{display:block;font-family:'Sora',sans-serif;font-size:24px;font-weight:800;color:var(--gold)}\n.about-stat-box small{font-size:10px;color:rgba(255,255,255,.55);text-transform:uppercase;letter-spacing:1px}\n.about-float{position:absolute;bottom:-18px;right:-18px;background:#fff;border-radius:14px;padding:14px 18px;box-shadow:0 8px 30px rgba(0,0,0,.1);border:1px solid var(--border)}\n.about-float strong{display:block;font-size:15px;font-weight:800;color:var(--navy)}\n.about-float small{font-size:11px;color:var(--gray)}\n.about-points{display:flex;flex-direction:column;gap:22px}\n.a-pt{display:flex;gap:16px;align-items:flex-start}\n.a-pt-icon{width:44px;height:44px;min-width:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--light2)}\n.a-pt-icon i{color:var(--navy);font-size:18px}\n.a-pt-body h4{font-weight:700;font-size:14px;margin-bottom:4px;color:var(--navy)}\n.a-pt-body p{font-size:13px;color:var(--gray);line-height:1.65}\n\n/* ─── COURSES ─── */\n.courses-section{background:var(--light)}\n.courses-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:40px}\n.view-all-btn{font-size:13px;color:var(--navy);font-weight:700;border:1.5px solid var(--navy);padding:9px 20px;border-radius:8px;transition:all .2s;display:inline-block}\n.view-all-btn:hover{background:var(--navy);color:#fff}\n.courses-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}\n.course-card{background:#fff;border-radius:16px;overflow:hidden;border:1px solid var(--border);transition:all .3s;cursor:pointer}\n.course-card:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(27,46,107,.12);border-color:var(--navy)}\n.course-top{padding:22px 22px 16px;position:relative}\n.course-icon-wrap{width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:14px}\n.course-icon-wrap i{font-size:21px;color:#fff}\n.course-title{font-weight:800;font-size:15px;color:var(--navy);margin-bottom:6px;line-height:1.3}\n.course-desc{font-size:12px;color:var(--gray);line-height:1.6}\n.course-badge{position:absolute;top:18px;right:18px;font-size:10px;font-weight:700;padding:3px 10px;border-radius:50px;letter-spacing:.5px}\n.course-bottom{padding:14px 22px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background:var(--light)}\n.course-meta span{font-size:11px;color:var(--gray);font-weight:600;display:inline-flex;align-items:center;gap:4px;margin-right:12px}\n.course-price{font-family:'Sora',sans-serif;font-size:18px;font-weight:800;color:var(--navy)}\n\n/* ─── MOCK TEST ─── */\n.mock-section{background:#fff}\n.mock-layout{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;margin-top:55px}\n.mock-feat-list{display:flex;flex-direction:column;gap:14px;margin-top:28px}\n.mock-feat{display:flex;gap:14px;align-items:flex-start;padding:15px 17px;border-radius:12px;border:1px solid var(--border);transition:all .25s}\n.mock-feat:hover{border-color:var(--navy);background:var(--light)}\n.mock-feat-icon{width:42px;height:42px;min-width:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:var(--light2)}\n.mock-feat-icon i{color:var(--navy);font-size:17px}\n.mock-feat h4{font-weight:700;font-size:14px;color:var(--navy);margin-bottom:3px}\n.mock-feat p{font-size:12px;color:var(--gray);line-height:1.55}\n.mock-cta{display:inline-flex;align-items:center;gap:8px;margin-top:24px;padding:13px 28px;background:var(--gold);color:var(--navy);border-radius:10px;font-weight:800;font-size:14px;border:none;cursor:pointer;transition:all .3s;font-family:'Plus Jakarta Sans',sans-serif}\n.mock-cta:hover{background:var(--gold2);transform:translateY(-1px)}\n.mock-ui{background:var(--light);border-radius:20px;padding:26px;border:1px solid var(--border)}\n.mock-header-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}\n.mock-exam-name{font-size:12px;font-weight:700;color:var(--navy)}\n.mock-timer{background:var(--navy);color:#fff;font-family:'Sora',sans-serif;font-size:16px;font-weight:700;padding:6px 14px;border-radius:8px}\n.mock-prog{display:flex;gap:4px;margin-bottom:18px}\n.mock-prog span{height:5px;flex:1;border-radius:3px;background:var(--border)}\n.mock-prog span.done{background:var(--navy)}\n.mock-prog span.cur{background:var(--gold)}\n.mock-q-lbl{font-size:11px;font-weight:700;color:var(--gray);letter-spacing:1px;text-transform:uppercase;margin-bottom:7px}\n.mock-q-text{font-weight:700;font-size:14px;color:var(--navy);line-height:1.6;margin-bottom:18px}\n.mock-opts{display:flex;flex-direction:column;gap:8px}\n.mock-opt{padding:11px 15px;border-radius:8px;border:1.5px solid var(--border);font-size:13px;color:var(--gray);cursor:pointer;display:flex;align-items:center;gap:10px;background:#fff;font-weight:600;transition:all .2s}\n.mock-opt:hover{border-color:var(--navy);color:var(--navy)}\n.mock-opt.correct{border-color:#22C55E;background:#F0FDF4;color:#15803D}\n.opt-circle{width:24px;height:24px;border-radius:50%;border:2px solid currentColor;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0}\n.mock-nav{display:flex;gap:10px;margin-top:16px}\n.mock-nav button{flex:1;padding:10px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s}\n.mock-nav .prev{background:#fff;border:1.5px solid var(--border);color:var(--gray)}\n.mock-nav .next{background:var(--navy);border:none;color:#fff}\n\n/* ─── FACULTY ─── */\n.faculty-section{background:var(--light)}\n.faculty-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:44px}\n.faculty-card{background:#fff;border-radius:16px;border:1px solid var(--border);overflow:hidden;transition:all .3s;text-align:center}\n.faculty-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(27,46,107,.1);border-color:var(--navy)}\n.faculty-top{padding:28px 20px 50px;position:relative}\n.faculty-avatar{width:78px;height:78px;border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:22px;font-weight:800;color:#fff;position:absolute;bottom:-39px;left:50%;transform:translateX(-50%);box-shadow:0 4px 16px rgba(0,0,0,.15)}\n.faculty-body{padding:50px 16px 22px}\n.faculty-name{font-weight:800;font-size:14px;color:var(--navy);margin-bottom:4px}\n.faculty-role{font-size:11px;color:var(--gold2);font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px}\n.faculty-exp{font-size:12px;color:var(--gray);margin-bottom:12px}\n.faculty-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:5px}\n.fchip{font-size:10px;padding:3px 9px;background:var(--light2);border-radius:50px;color:var(--navy);font-weight:700}\n\n/* ─── FAQ ─── */\n.faq-section{background:#fff}\n.faq-wrap{max-width:740px;margin:44px auto 0}\n.faq-item{border:1px solid var(--border);border-radius:12px;margin-bottom:10px;overflow:hidden;transition:all .3s}\n.faq-item.open{border-color:var(--navy);box-shadow:0 4px 20px rgba(27,46,107,.08)}\n.faq-q{display:flex;justify-content:space-between;align-items:center;padding:18px 22px;cursor:pointer;font-weight:700;font-size:14px;color:var(--navy);gap:16px}\n.faq-q:hover{background:var(--light)}\n.faq-toggle{width:32px;height:32px;min-width:32px;border-radius:50%;background:var(--light2);display:flex;align-items:center;justify-content:center;transition:all .3s}\n.faq-toggle i{color:var(--navy);font-size:13px;transition:transform .3s}\n.faq-item.open .faq-toggle{background:var(--navy)}\n.faq-item.open .faq-toggle i{color:#fff;transform:rotate(45deg)}\n.faq-ans{max-height:0;overflow:hidden;transition:max-height .35s ease}\n.faq-ans p{padding:0 22px 18px;font-size:13px;color:var(--gray);line-height:1.75}\n.faq-item.open .faq-ans{max-height:200px}\n\n/* ─── CONTACT ─── */\n.contact-section{background:var(--light)}\n.contact-grid{display:grid;grid-template-columns:1fr 1.5fr;gap:60px;margin-top:55px}\n.c-card-list{display:flex;flex-direction:column;gap:16px}\n.c-card{display:flex;gap:16px;align-items:flex-start;background:#fff;border-radius:14px;padding:18px;border:1px solid var(--border)}\n.c-icon{width:46px;height:46px;min-width:46px;border-radius:12px;background:var(--light2);display:flex;align-items:center;justify-content:center}\n.c-icon i{color:var(--navy);font-size:19px}\n.c-text h4{font-weight:700;font-size:13px;color:var(--navy);margin-bottom:3px}\n.c-text p{font-size:12px;color:var(--gray);line-height:1.6}\n.contact-form-box{background:#fff;border-radius:20px;padding:36px;border:1px solid var(--border);box-shadow:0 4px 24px rgba(0,0,0,.05)}\n.cf-title{font-family:'Sora',sans-serif;font-size:22px;font-weight:800;color:var(--navy);margin-bottom:22px}\n.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}\n.form-field{margin-bottom:14px}\n.form-field label{display:block;font-size:11px;font-weight:700;color:var(--gray);letter-spacing:1px;text-transform:uppercase;margin-bottom:7px}\n.form-field input,.form-field select,.form-field textarea{width:100%;background:var(--light);border:1.5px solid var(--border);border-radius:8px;padding:11px 14px;color:var(--text);font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;transition:border-color .2s;outline:none}\n.form-field input:focus,.form-field select:focus,.form-field textarea:focus{border-color:var(--navy);background:#fff}\n.form-field textarea{resize:none;height:100px}\n.form-field select option{background:#fff}\n.cf-submit{width:100%;padding:13px;background:var(--navy);color:#fff;border:none;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:14px;cursor:pointer;transition:all .3s;display:flex;align-items:center;justify-content:center;gap:8px}\n.cf-submit:hover{background:var(--navy3);transform:translateY(-1px);box-shadow:0 8px 24px rgba(27,46,107,.3)}\n\n/* ─── FOOTER ─── */\nfooter{background:var(--navy3);color:#fff;padding:60px 5% 28px}\n.footer-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px}\n.fbrand-row{display:flex;align-items:center;gap:12px;margin-bottom:14px}\n.footer-brand p{font-size:13px;color:rgba(255,255,255,.5);line-height:1.8;max-width:250px}\n.footer-socials{display:flex;gap:8px;margin-top:18px}\n.fsoc{width:36px;height:36px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s}\n.fsoc:hover{background:var(--gold);border-color:var(--gold)}\n.fsoc:hover i{color:var(--navy)}\n.fsoc i{color:rgba(255,255,255,.55);font-size:14px}\n.footer-col h5{font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);margin-bottom:18px}\n.footer-col ul{list-style:none;display:flex;flex-direction:column;gap:10px}\n.footer-col ul li a{font-size:13px;color:rgba(255,255,255,.45);transition:color .2s}\n.footer-col ul li a:hover{color:#fff}\n.footer-bottom{border-top:1px solid rgba(255,255,255,.08);padding-top:22px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}\n.footer-bottom p{font-size:12px;color:rgba(255,255,255,.3)}\n.footer-bottom span{color:var(--gold)}\n\n/* ─── TESTIMONIALS STRIP ─── */\n.testi-section{background:var(--navy);padding:60px 5%}\n.testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:40px}\n.testi-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:24px}\n.testi-stars{display:flex;gap:3px;margin-bottom:14px}\n.testi-stars i{color:var(--gold);font-size:13px}\n.testi-text{font-size:13px;color:rgba(255,255,255,.75);line-height:1.75;margin-bottom:18px}\n.testi-author{display:flex;align-items:center;gap:10px}\n.testi-avatar{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:13px;font-weight:800;color:#fff}\n.testi-name{font-weight:700;font-size:13px;color:#fff}\n.testi-bank{font-size:11px;color:var(--gold);font-weight:600}"
const pageMarkup = "<!-- HEADER -->\n<header>\n  <div class=\"header-inner\">\n    <div class=\"logo-wrap\">\n      <svg width=\"48\" height=\"48\" viewBox=\"0 0 48 48\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle cx=\"24\" cy=\"19\" r=\"16\" stroke=\"#F5C518\" stroke-width=\"2.5\" fill=\"none\"/>\n        <text x=\"19\" y=\"27\" font-family=\"Sora,sans-serif\" font-weight=\"800\" font-size=\"15\" fill=\"#1B2E6B\">K</text>\n        <text x=\"28\" y=\"25\" font-family=\"Sora,sans-serif\" font-weight=\"800\" font-size=\"15\" fill=\"#E8A800\">R</text>\n        <rect x=\"9\" y=\"33\" width=\"9\" height=\"2\" rx=\"1\" fill=\"#1B2E6B\"/>\n        <rect x=\"30\" y=\"33\" width=\"9\" height=\"2\" rx=\"1\" fill=\"#1B2E6B\"/>\n        <rect x=\"6\"  y=\"36\" width=\"12\" height=\"2\" rx=\"1\" fill=\"#1B2E6B\" opacity=\".6\"/>\n        <rect x=\"30\" y=\"36\" width=\"12\" height=\"2\" rx=\"1\" fill=\"#1B2E6B\" opacity=\".6\"/>\n        <line x1=\"24\" y1=\"33\" x2=\"24\" y2=\"46\" stroke=\"#E8A800\" stroke-width=\"1.8\"/>\n        <rect x=\"20\" y=\"42\" width=\"8\" height=\"3\" rx=\".5\" fill=\"#E8A800\"/>\n        <circle cx=\"24\" cy=\"47\" r=\"1.5\" fill=\"#E8A800\"/>\n        <rect x=\"28\" y=\"9\"  width=\"7\" height=\"5\" rx=\"1\" fill=\"#1B2E6B\"/>\n        <polygon points=\"26,7 35,7 35,9 26,9\" fill=\"#E8A800\"/>\n        <rect x=\"29.5\" y=\"7\" width=\"1.5\" height=\"3\" fill=\"#1B2E6B\"/>\n      </svg>\n      <div class=\"logo-text-group\">\n        <div class=\"brand\">KR <span>Logics</span></div>\n        <div class=\"tagline\">IBPS · SBI · RBI · Insurance</div>\n      </div>\n    </div>\n    <nav>\n      <a href=\"https://krlogicsblog.com/\" target=\"_blank\" rel=\"noopener noreferrer\">Blog</a>\n      <a href=\"/courses\">Courses</a>\n      <div class=\"exam-menu-wrap\">\n      <a href=\"/mock-tests\" class=\"exam-menu-trigger\">Exams <i class=\"fa fa-chevron-down\"></i></a>\n      <div class=\"exam-mega\">\n        <div class=\"exam-cats\">\n          <a href=\"/mock-tests\" class=\"exam-cat active\">Banking &amp; Insurance <i class=\"fa fa-chevron-right\"></i></a>\n          <a href=\"/mock-tests\" class=\"exam-cat\">SSC &amp; Railway <i class=\"fa fa-chevron-right\"></i></a>\n          <a href=\"/mock-tests\" class=\"exam-cat\">Regulatory bodies <i class=\"fa fa-chevron-right\"></i></a>\n          <a href=\"/mock-tests\" class=\"exam-cat\">JAIIB/CAIIB <i class=\"fa fa-chevron-right\"></i></a>\n          <a href=\"/mock-tests\" class=\"exam-cat\">JK State Exams <i class=\"fa fa-chevron-right\"></i></a>\n          <a href=\"/mock-tests\" class=\"exam-cat\">CAIIB <i class=\"fa fa-chevron-right\"></i></a>\n        </div>\n        <div class=\"exam-grid\">\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon sky\"><i class=\"fa fa-map-pin\"></i></span>SBI PO</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon blue\">IB</span>IBPS PO</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon blue\">IB</span>IBPS Clerk</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon sky\"><i class=\"fa fa-map-pin\"></i></span>SBI Clerk</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon blue\">IB</span>IBPS RRB PO</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon blue\">IB</span>IBPS RRB Clerk</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon gold\"><i class=\"fa fa-building-columns\"></i></span>Punjab and Sind Bank ...</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon blue\">IB</span>IBPS SO</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon gray\"><i class=\"fa fa-shield-alt\"></i></span>LIC HFL Junior Assistant</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon sky\"><i class=\"fa fa-map-pin\"></i></span>SBI Apprentice</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon red\">BOB</span>Bank of Baroda LBO</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon purple\"><i class=\"fa fa-star\"></i></span>Karnataka Bank</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon blue\"><i class=\"fa fa-university\"></i></span>Central Bank of India Z...</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon red\"><i class=\"fa fa-chart-line\"></i></span>UBI Apprentice</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon soft\"><i class=\"fa fa-landmark\"></i></span>Indian Overseas Bank</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon soft\"><i class=\"fa fa-circle\"></i></span>OICL AO</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon red\"><i class=\"fa fa-building\"></i></span>South Indian Bank Clerk</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon soft\"><i class=\"fa fa-bolt\"></i></span>J &amp; K Bank Apprentice</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon red\"><i class=\"fa fa-building\"></i></span>Saraswat Bank BDO</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon sky\"><i class=\"fa fa-map-pin\"></i></span>SBI CBO</a>\n          <a href=\"/mock-tests\" class=\"exam-link\"><span class=\"exam-icon soft\"><i class=\"fa fa-coins\"></i></span>ECGC PO</a>\n        </div>\n      </div>\n    </div>\n      <a href=\"/mock-tests\">Mock Tests</a>\n      <a href=\"/faculty\">Faculty</a>\n\n      <a href=\"/contact\">Contact</a>\n    </nav>\n    <div class=\"hdr-btns\">\n      <a href=\"/login\" class=\"btn-ghost\">Login</a>\n      <a href=\"/register\" class=\"btn-primary\">Enroll Free →</a>\n    </div>\n  </div>\n</header>\n\n<!-- HERO -->\n<section class=\"hero\" id=\"home\">\n  <div class=\"hero-bg-circle\"></div>\n  <div class=\"hero-bg-gold\"></div>\n  <div class=\"hero-inner\">\n    <div style=\"z-index:2\">\n      <div class=\"hero-badge\"><span class=\"dot\"></span> India's #1 Banking Exam Platform</div>\n      <h1>Crack Your<br><em>Banking Exam</em><br>With Confidence</h1>\n      <p class=\"hero-p\">Expert-led preparation for IBPS, SBI, RBI, Insurance &amp; all competitive exams. Structured courses, live mock tests &amp; personal mentoring from India's top faculty.</p>\n      <div class=\"hero-chips\">\n        <span class=\"chip\">IBPS PO / Clerk</span>\n        <span class=\"chip\">SBI PO / Clerk</span>\n        <span class=\"chip\">RBI Grade B</span>\n        <span class=\"chip\">Insurance (LIC/GIC)</span>\n        <span class=\"chip\">SSC / Railway</span>\n      </div>\n      <div class=\"hero-btns\">\n        <a href=\"/courses\" class=\"hero-btn-main\"><i class=\"fa fa-graduation-cap\"></i> Explore Courses</a>\n        <a href=\"/mock-tests\" class=\"hero-btn-sec\"><i class=\"fa fa-file-alt\"></i> Free Mock Test</a>\n      </div>\n      <div class=\"hero-stats\">\n        <div class=\"hstat\"><strong>12,500+</strong><small>Active Students</small></div>\n        <div class=\"hstat\"><strong>850+</strong><small>Selections</small></div>\n        <div class=\"hstat\"><strong>200+</strong><small>Mock Tests</small></div>\n        <div class=\"hstat\"><strong>7+ Yrs</strong><small>Experience</small></div>\n      </div>\n    </div>\n    <div class=\"hero-right\">\n      <div class=\"hero-card\">\n        <div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:12px\">\n          <div>\n            <div style=\"font-weight:800;font-size:14px;color:var(--navy)\">IBPS PO 2025 — Your Progress</div>\n            <div style=\"font-size:12px;color:var(--gray);margin-top:2px\">156 lessons · 78% complete</div>\n          </div>\n          <div class=\"hcard-icon\"><i class=\"fa fa-book\" style=\"color:var(--navy);font-size:18px\"></i></div>\n        </div>\n        <div class=\"prog-bar\"><div class=\"prog-fill\" style=\"width:78%\"></div></div>\n        <div style=\"display:flex;justify-content:space-between;font-size:11px;color:var(--gray);font-weight:600\"><span>122 Completed</span><span>78%</span></div>\n        <div class=\"hcard-row\">\n          <div class=\"hcard-half\"><strong>34</strong><small>Pending</small></div>\n          <div class=\"hcard-half\"><strong>14</strong><small>Tests Left</small></div>\n          <div class=\"hcard-half\"><strong>92%</strong><small>Avg Score</small></div>\n        </div>\n      </div>\n      <div class=\"mini-cards\">\n        <div class=\"mini-card-light\">\n          <div class=\"hcard-icon\" style=\"margin-bottom:10px\"><i class=\"fa fa-trophy\" style=\"color:var(--navy);font-size:18px\"></i></div>\n          <div style=\"font-family:'Sora',sans-serif;font-size:30px;font-weight:800;color:var(--navy)\">850+</div>\n          <div style=\"font-size:11px;color:var(--gray);font-weight:600;margin-top:2px\">Selections 2024</div>\n          <div style=\"font-size:11px;color:#22C55E;font-weight:700;margin-top:8px\"><i class=\"fa fa-arrow-up\"></i> Top 2% nationally</div>\n        </div>\n        <div class=\"mini-card-dark\">\n          <div style=\"width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;margin-bottom:10px\"><i class=\"fa fa-star\" style=\"color:var(--gold);font-size:18px\"></i></div>\n          <div style=\"font-family:'Sora',sans-serif;font-size:30px;font-weight:800;color:#fff\">4.9<span style=\"font-size:15px;color:rgba(255,255,255,.4)\">/5</span></div>\n          <div style=\"font-size:11px;color:rgba(255,255,255,.5);font-weight:600;margin-top:2px\">Student Rating</div>\n          <div style=\"display:flex;gap:2px;margin-top:8px\">\n            <i class=\"fa fa-star\" style=\"color:var(--gold);font-size:11px\"></i>\n            <i class=\"fa fa-star\" style=\"color:var(--gold);font-size:11px\"></i>\n            <i class=\"fa fa-star\" style=\"color:var(--gold);font-size:11px\"></i>\n            <i class=\"fa fa-star\" style=\"color:var(--gold);font-size:11px\"></i>\n            <i class=\"fa fa-star\" style=\"color:var(--gold);font-size:11px\"></i>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</section>\n\n<div class=\"divider\"></div>\n\n<!-- ABOUT -->\n<section class=\"about-section\" id=\"about\">\n  <div class=\"about-grid\">\n    <div style=\"position:relative\">\n      <div class=\"about-main-card\">\n        <div class=\"about-inner\">\n          <div class=\"about-logo-row\">\n            <svg width=\"46\" height=\"46\" viewBox=\"0 0 48 48\" xmlns=\"http://www.w3.org/2000/svg\">\n              <circle cx=\"24\" cy=\"19\" r=\"16\" stroke=\"#F5C518\" stroke-width=\"2.5\" fill=\"none\"/>\n              <text x=\"19\" y=\"27\" font-family=\"Sora,sans-serif\" font-weight=\"800\" font-size=\"15\" fill=\"white\">K</text>\n              <text x=\"28\" y=\"25\" font-family=\"Sora,sans-serif\" font-weight=\"800\" font-size=\"15\" fill=\"#F5C518\">R</text>\n              <rect x=\"9\" y=\"33\" width=\"9\" height=\"2\" rx=\"1\" fill=\"white\" opacity=\".6\"/>\n              <rect x=\"30\" y=\"33\" width=\"9\" height=\"2\" rx=\"1\" fill=\"white\" opacity=\".6\"/>\n              <line x1=\"24\" y1=\"33\" x2=\"24\" y2=\"46\" stroke=\"#F5C518\" stroke-width=\"1.8\"/>\n              <rect x=\"20\" y=\"42\" width=\"8\" height=\"3\" rx=\".5\" fill=\"#F5C518\"/>\n            </svg>\n            <div>\n              <div style=\"font-family:'Sora',sans-serif;font-size:22px;font-weight:800;color:#fff\">KR Logics</div>\n              <div style=\"font-size:10px;color:rgba(255,255,255,.45);letter-spacing:1.5px;text-transform:uppercase\">Est. 2017</div>\n            </div>\n          </div>\n          <p style=\"font-size:14px;color:rgba(255,255,255,.65);line-height:1.8;margin-bottom:20px\">India's most trusted banking exam coaching platform with proven results across IBPS, SBI, RBI and Insurance exams.</p>\n          <div class=\"about-stat-row\">\n            <div class=\"about-stat-box\"><strong>7+</strong><small>Years</small></div>\n            <div class=\"about-stat-box\"><strong>12K+</strong><small>Students</small></div>\n            <div class=\"about-stat-box\"><strong>850+</strong><small>Selected</small></div>\n          </div>\n        </div>\n      </div>\n      <div class=\"about-float\">\n        <strong>🏆 Best Coaching 2024</strong>\n        <small>Rajasthan Banking Category</small>\n      </div>\n    </div>\n    <div>\n      <div class=\"sec-eyebrow\">About Us</div>\n      <h2 class=\"sec-title\">Building India's<br>Banking Professionals</h2>\n      <p style=\"font-size:15px;color:var(--gray);line-height:1.85;margin-bottom:30px\">KR Logics is dedicated to transforming banking aspirants into successful professionals through expert guidance, updated content and cutting-edge technology.</p>\n      <div class=\"about-points\">\n        <div class=\"a-pt\"><div class=\"a-pt-icon\"><i class=\"fa fa-graduation-cap\"></i></div><div class=\"a-pt-body\"><h4>Expert-Led Curriculum</h4><p>Specially designed material covering Quant, Reasoning, English, GK &amp; Banking Awareness — updated with every exam pattern change.</p></div></div>\n        <div class=\"a-pt\"><div class=\"a-pt-icon\"><i class=\"fa fa-laptop\"></i></div><div class=\"a-pt-body\"><h4>Flexible Learning — Online &amp; Offline</h4><p>Recorded lectures, live classes and 200+ mock tests accessible on any device, anytime, anywhere.</p></div></div>\n        <div class=\"a-pt\"><div class=\"a-pt-icon\"><i class=\"fa fa-users\"></i></div><div class=\"a-pt-body\"><h4>Personal Mentorship</h4><p>1-on-1 doubt sessions, performance tracking and personalized study plans for each student's strengths and weaknesses.</p></div></div>\n        <div class=\"a-pt\"><div class=\"a-pt-icon\"><i class=\"fa fa-chart-line\"></i></div><div class=\"a-pt-body\"><h4>AI-Powered Analytics</h4><p>Topic-wise accuracy, speed tracking, percentile ranking and smart recommendations on what to study next.</p></div></div>\n      </div>\n    </div>\n  </div>\n</section>\n\n<div class=\"divider\"></div>\n\n<!-- COURSES -->\n<section class=\"courses-section\" id=\"courses\">\n  <div class=\"courses-header\">\n    <div>\n      <div class=\"sec-eyebrow\">Programs</div>\n      <h2 class=\"sec-title\">Top Courses</h2>\n    </div>\n    <a href=\"/courses\" class=\"view-all-btn\">View All Courses →</a>\n  </div>\n  <div class=\"courses-grid\">\n    <div class=\"course-card\">\n      <div class=\"course-top\">\n        <div class=\"course-icon-wrap\" style=\"background:#1B2E6B\"><i class=\"fa fa-university\"></i></div>\n        <span class=\"course-badge\" style=\"background:#EEF6FF;color:#1B2E6B\">POPULAR</span>\n        <div class=\"course-title\">IBPS PO Complete Course</div>\n        <div class=\"course-desc\">Full preparation for IBPS PO — Prelims + Mains + Interview with latest pattern questions</div>\n      </div>\n      <div class=\"course-bottom\">\n        <div class=\"course-meta\"><span><i class=\"fa fa-clock\"></i> 120 hrs</span><span><i class=\"fa fa-file-alt\"></i> 200+ Tests</span></div>\n        <div class=\"course-price\">₹4,999</div>\n      </div>\n    </div>\n    <div class=\"course-card\">\n      <div class=\"course-top\">\n        <div class=\"course-icon-wrap\" style=\"background:#1D9E75\"><i class=\"fa fa-piggy-bank\"></i></div>\n        <span class=\"course-badge\" style=\"background:#E1F5EE;color:#0F6E56\">HOT</span>\n        <div class=\"course-title\">SBI PO / Clerk Full Course</div>\n        <div class=\"course-desc\">Comprehensive SBI exam prep with sectional tests &amp; previous year analysis</div>\n      </div>\n      <div class=\"course-bottom\">\n        <div class=\"course-meta\"><span><i class=\"fa fa-clock\"></i> 100 hrs</span><span><i class=\"fa fa-file-alt\"></i> 150+ Tests</span></div>\n        <div class=\"course-price\">₹3,999</div>\n      </div>\n    </div>\n    <div class=\"course-card\">\n      <div class=\"course-top\">\n        <div class=\"course-icon-wrap\" style=\"background:#D85A30\"><i class=\"fa fa-landmark\"></i></div>\n        <span class=\"course-badge\" style=\"background:#FAECE7;color:#993C1D\">PREMIUM</span>\n        <div class=\"course-title\">RBI Grade B Preparation</div>\n        <div class=\"course-desc\">Phase I + II with Economics, Finance &amp; Management — India's toughest banking exam</div>\n      </div>\n      <div class=\"course-bottom\">\n        <div class=\"course-meta\"><span><i class=\"fa fa-clock\"></i> 180 hrs</span><span><i class=\"fa fa-file-alt\"></i> 100+ Tests</span></div>\n        <div class=\"course-price\">₹7,999</div>\n      </div>\n    </div>\n    <div class=\"course-card\">\n      <div class=\"course-top\">\n        <div class=\"course-icon-wrap\" style=\"background:#7F77DD\"><i class=\"fa fa-shield-alt\"></i></div>\n        <div class=\"course-title\">Insurance Exams (LIC/GIC)</div>\n        <div class=\"course-desc\">LIC AAO, NIACL, GIC &amp; other insurance exams — complete focused preparation</div>\n      </div>\n      <div class=\"course-bottom\">\n        <div class=\"course-meta\"><span><i class=\"fa fa-clock\"></i> 80 hrs</span><span><i class=\"fa fa-file-alt\"></i> 80+ Tests</span></div>\n        <div class=\"course-price\">₹2,999</div>\n      </div>\n    </div>\n    <div class=\"course-card\">\n      <div class=\"course-top\">\n        <div class=\"course-icon-wrap\" style=\"background:#BA7517\"><i class=\"fa fa-calculator\"></i></div>\n        <span class=\"course-badge\" style=\"background:#FAEEDA;color:#633806\">NEW</span>\n        <div class=\"course-title\">Quantitative Aptitude Mastery</div>\n        <div class=\"course-desc\">DI, Arithmetic, Algebra &amp; Number Systems — basics to advanced level</div>\n      </div>\n      <div class=\"course-bottom\">\n        <div class=\"course-meta\"><span><i class=\"fa fa-clock\"></i> 60 hrs</span><span><i class=\"fa fa-file-alt\"></i> 120+ Tests</span></div>\n        <div class=\"course-price\">₹1,999</div>\n      </div>\n    </div>\n    <div class=\"course-card\">\n      <div class=\"course-top\">\n        <div class=\"course-icon-wrap\" style=\"background:#378ADD\"><i class=\"fa fa-brain\"></i></div>\n        <div class=\"course-title\">Reasoning Crash Course</div>\n        <div class=\"course-desc\">Puzzles, Seating, Coding-Decoding, Syllogism — master all reasoning topics in 30 days</div>\n      </div>\n      <div class=\"course-bottom\">\n        <div class=\"course-meta\"><span><i class=\"fa fa-clock\"></i> 45 hrs</span><span><i class=\"fa fa-file-alt\"></i> 90+ Tests</span></div>\n        <div class=\"course-price\">₹1,499</div>\n      </div>\n    </div>\n  </div>\n</section>\n\n<div class=\"divider\"></div>\n\n<!-- MOCK TEST -->\n<section class=\"mock-section\" id=\"mock\">\n  <div class=\"mock-layout\">\n    <div>\n      <div class=\"sec-eyebrow\">Test Series</div>\n      <h2 class=\"sec-title\">Mock Test<br>Platform</h2>\n      <p style=\"font-size:15px;color:var(--gray);line-height:1.8\">Practice with India's most updated mock tests designed by banking experts. Real exam feel with instant in-depth analysis.</p>\n      <div class=\"mock-feat-list\">\n        <div class=\"mock-feat\"><div class=\"mock-feat-icon\"><i class=\"fa fa-desktop\"></i></div><div><h4>Real Exam Interface</h4><p>Exactly like the actual exam — timer, section switching &amp; question navigation</p></div></div>\n        <div class=\"mock-feat\"><div class=\"mock-feat-icon\"><i class=\"fa fa-chart-bar\"></i></div><div><h4>Deep Performance Analysis</h4><p>Accuracy, speed, topic-wise score &amp; All India percentile ranking</p></div></div>\n        <div class=\"mock-feat\"><div class=\"mock-feat-icon\"><i class=\"fa fa-video\"></i></div><div><h4>Video Solutions</h4><p>Detailed video explanations for every question from expert faculty</p></div></div>\n        <div class=\"mock-feat\"><div class=\"mock-feat-icon\"><i class=\"fa fa-users\"></i></div><div><h4>All India Rankings</h4><p>Compete with 12,000+ students &amp; know exactly where you stand</p></div></div>\n      </div>\n      <a href=\"/mock-tests\" class=\"mock-cta\"><i class=\"fa fa-play-circle\"></i> Start Free Mock Test</a>\n    </div>\n    <div>\n      <div class=\"mock-ui\">\n        <div class=\"mock-header-bar\">\n          <div class=\"mock-exam-name\">IBPS PO Prelims 2025 — Mock #7</div>\n          <div class=\"mock-timer\">23:47</div>\n        </div>\n        <div class=\"mock-prog\">\n          <span class=\"done\"></span><span class=\"done\"></span><span class=\"done\"></span><span class=\"cur\"></span><span></span><span></span><span></span><span></span><span></span><span></span>\n        </div>\n        <div class=\"mock-q-lbl\">Question 4 of 35 · Reasoning Ability</div>\n        <div class=\"mock-q-text\">In a row of 40 students, Rahul is 15th from the left. Priya is 10 positions to the right of Rahul. What is Priya's position from the right end?</div>\n        <div class=\"mock-opts\">\n          <div class=\"mock-opt\"><span class=\"opt-circle\">A</span> 14th from the right</div>\n          <div class=\"mock-opt correct\"><span class=\"opt-circle\">B</span> 16th from the right <i class=\"fa fa-check-circle\" style=\"margin-left:auto;font-size:14px\"></i></div>\n          <div class=\"mock-opt\"><span class=\"opt-circle\">C</span> 18th from the right</div>\n          <div class=\"mock-opt\"><span class=\"opt-circle\">D</span> 12th from the right</div>\n        </div>\n        <div class=\"mock-nav\">\n          <button class=\"prev\">← Previous</button>\n          <button class=\"next\">Save &amp; Next →</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</section>\n\n<div class=\"divider\"></div>\n\n<!-- FACULTY -->\n<section class=\"faculty-section\" id=\"faculty\">\n  <div class=\"sec-center\">\n    <div class=\"sec-eyebrow\">Expert Mentors</div>\n    <h2 class=\"sec-title\">Our Faculty</h2>\n    <p class=\"sec-sub\">Learn from experienced educators with proven track records in banking exam coaching across India.</p>\n  </div>\n  <div class=\"faculty-grid\">\n    <div class=\"faculty-card\">\n      <div class=\"faculty-top\" style=\"background:var(--light2)\"><div class=\"faculty-avatar\" style=\"background:var(--navy)\">KR</div></div>\n      <div class=\"faculty-body\"><div class=\"faculty-name\">Karan Rajput</div><div class=\"faculty-role\">Founder &amp; Director</div><div class=\"faculty-exp\">10+ years experience</div><div class=\"faculty-chips\"><span class=\"fchip\">Reasoning</span><span class=\"fchip\">Quant</span><span class=\"fchip\">Strategy</span></div></div>\n    </div>\n    <div class=\"faculty-card\">\n      <div class=\"faculty-top\" style=\"background:#F0FDF4\"><div class=\"faculty-avatar\" style=\"background:#15803D\">AM</div></div>\n      <div class=\"faculty-body\"><div class=\"faculty-name\">Ankita Mehra</div><div class=\"faculty-role\">English Expert</div><div class=\"faculty-exp\">8 years experience</div><div class=\"faculty-chips\"><span class=\"fchip\">English</span><span class=\"fchip\">Reading</span><span class=\"fchip\">Grammar</span></div></div>\n    </div>\n    <div class=\"faculty-card\">\n      <div class=\"faculty-top\" style=\"background:#EEF6FF\"><div class=\"faculty-avatar\" style=\"background:#185FA5\">RS</div></div>\n      <div class=\"faculty-body\"><div class=\"faculty-name\">Rohit Sharma</div><div class=\"faculty-role\">Quant Specialist</div><div class=\"faculty-exp\">9 years experience</div><div class=\"faculty-chips\"><span class=\"fchip\">DI</span><span class=\"fchip\">Arithmetic</span><span class=\"fchip\">Algebra</span></div></div>\n    </div>\n    <div class=\"faculty-card\">\n      <div class=\"faculty-top\" style=\"background:#FFF7ED\"><div class=\"faculty-avatar\" style=\"background:#D85A30\">PK</div></div>\n      <div class=\"faculty-body\"><div class=\"faculty-name\">Priya Kumari</div><div class=\"faculty-role\">Banking &amp; GK</div><div class=\"faculty-exp\">7 years experience</div><div class=\"faculty-chips\"><span class=\"fchip\">Current Affairs</span><span class=\"fchip\">Banking GK</span></div></div>\n    </div>\n  </div>\n</section>\n\n<div class=\"divider\"></div>\n\n<!-- TESTIMONIALS -->\n<section class=\"testi-section\">\n  <div class=\"sec-center\">\n    <div class=\"sec-eyebrow\" style=\"background:rgba(245,197,24,.15);color:var(--gold)\">Student Stories</div>\n    <h2 class=\"sec-title\" style=\"color:#fff\">What Our Students Say</h2>\n    <p class=\"sec-sub\" style=\"color:rgba(255,255,255,.55)\">Real success stories from students who cracked their banking exams with KR Logics.</p>\n  </div>\n  <div class=\"testi-grid\">\n    <div class=\"testi-card\">\n      <div class=\"testi-stars\"><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i></div>\n      <div class=\"testi-text\">\"KR Logics mock tests are exactly like the real exam. The detailed analysis after each test helped me identify my weak areas. Cleared IBPS PO in my first attempt!\"</div>\n      <div class=\"testi-author\">\n        <div class=\"testi-avatar\" style=\"background:#1D9E75\">RK</div>\n        <div><div class=\"testi-name\">Rahul Kumar</div><div class=\"testi-bank\">IBPS PO 2024 — PNB</div></div>\n      </div>\n    </div>\n    <div class=\"testi-card\">\n      <div class=\"testi-stars\"><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i></div>\n      <div class=\"testi-text\">\"Faculty is absolutely amazing. Ankita ma'am's English classes changed my approach completely. Scored 98 percentile in English section. Got placed in SBI Clerk!\"</div>\n      <div class=\"testi-author\">\n        <div class=\"testi-avatar\" style=\"background:#7F77DD\">PS</div>\n        <div><div class=\"testi-name\">Prachi Sharma</div><div class=\"testi-bank\">SBI Clerk 2024 — Jaipur</div></div>\n      </div>\n    </div>\n    <div class=\"testi-card\">\n      <div class=\"testi-stars\"><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i><i class=\"fa fa-star\"></i></div>\n      <div class=\"testi-text\">\"The RBI Grade B course is phenomenal. Extremely detailed content on Economics and Finance. Karan sir's personal mentoring made a huge difference in my preparation strategy.\"</div>\n      <div class=\"testi-author\">\n        <div class=\"testi-avatar\" style=\"background:#D85A30\">AM</div>\n        <div><div class=\"testi-name\">Amit Mishra</div><div class=\"testi-bank\">RBI Grade B 2024</div></div>\n      </div>\n    </div>\n  </div>\n</section>\n\n<!-- FAQ -->\n<section class=\"faq-section\" id=\"faq\">\n  <div class=\"sec-center\">\n    <div class=\"sec-eyebrow\">Common Questions</div>\n    <h2 class=\"sec-title\">Frequently Asked Questions</h2>\n    <p class=\"sec-sub\">Everything you need to know about KR Logics courses and platform.</p>\n  </div>\n  <div class=\"faq-wrap\">\n    <div class=\"faq-item open\">\n      <div class=\"faq-q\">How are KR Logics courses different from other institutes?<span class=\"faq-toggle\"><i class=\"fa fa-plus\"></i></span></div>\n      <div class=\"faq-ans\"><p>KR Logics offers a unique blend of expert faculty, updated study material, real-exam mock tests and personal mentoring. Our 850+ selections in 2024 speak for our quality. Every student receives a personalized study plan and continuous performance tracking.</p></div>\n    </div>\n    <div class=\"faq-item\">\n      <div class=\"faq-q\">Can I access courses on mobile and tablet?<span class=\"faq-toggle\"><i class=\"fa fa-plus\"></i></span></div>\n      <div class=\"faq-ans\"><p>Yes! Our LMS platform is fully responsive and works on all devices. Download our mobile app for offline access to lectures and study materials, so you can study even without internet.</p></div>\n    </div>\n    <div class=\"faq-item\">\n      <div class=\"faq-q\">How long do I have access to course materials?<span class=\"faq-toggle\"><i class=\"fa fa-plus\"></i></span></div>\n      <div class=\"faq-ans\"><p>All enrollments give 12 months of full access including all updates, new mock tests and lecture updates as per latest exam patterns. No extra cost during your subscription period.</p></div>\n    </div>\n    <div class=\"faq-item\">\n      <div class=\"faq-q\">Do you offer EMI or installment payment options?<span class=\"faq-toggle\"><i class=\"fa fa-plus\"></i></span></div>\n      <div class=\"faq-ans\"><p>Yes, easy EMI options are available through major payment gateways — pay in 3–6 installments at zero extra interest. We also offer scholarship programs for deserving students.</p></div>\n    </div>\n    <div class=\"faq-item\">\n      <div class=\"faq-q\">Are there live doubt-clearing sessions?<span class=\"faq-toggle\"><i class=\"fa fa-plus\"></i></span></div>\n      <div class=\"faq-ans\"><p>Weekly live doubt sessions for every subject are conducted by our faculty. Students can also submit questions through the portal and get video responses within 24 hours.</p></div>\n    </div>\n    <div class=\"faq-item\">\n      <div class=\"faq-q\">Is there a free trial available?<span class=\"faq-toggle\"><i class=\"fa fa-plus\"></i></span></div>\n      <div class=\"faq-ans\"><p>Yes! 7-day free trial with 2 free mock tests, sample lectures and one doubt session. No credit card required — just register and start immediately.</p></div>\n    </div>\n  </div>\n</section>\n\n<div class=\"divider\"></div>\n\n<!-- CONTACT -->\n<section class=\"contact-section\" id=\"contact\">\n  <div class=\"sec-eyebrow\">Get In Touch</div>\n  <h2 class=\"sec-title\">Contact Us</h2>\n  <div class=\"contact-grid\">\n    <div>\n      <p style=\"font-size:15px;color:var(--gray);line-height:1.8;margin-bottom:26px\">Have questions about admissions or courses? Our counselling team is ready to help you choose the right path for your banking career.</p>\n      <div class=\"c-card-list\">\n        <div class=\"c-card\"><div class=\"c-icon\"><i class=\"fa fa-map-marker-alt\"></i></div><div class=\"c-text\"><h4>Our Location</h4><p>KR Logics Institute, Near City Mall,<br>Jodhpur, Rajasthan — 342001</p></div></div>\n        <div class=\"c-card\"><div class=\"c-icon\"><i class=\"fa fa-phone\"></i></div><div class=\"c-text\"><h4>Call Us</h4><p>+91 98765 43210<br>+91 87654 32109</p></div></div>\n        <div class=\"c-card\"><div class=\"c-icon\"><i class=\"fa fa-envelope\"></i></div><div class=\"c-text\"><h4>Email Us</h4><p>info@krlogics.com<br>admissions@krlogics.com</p></div></div>\n        <div class=\"c-card\"><div class=\"c-icon\"><i class=\"fa fa-clock\"></i></div><div class=\"c-text\"><h4>Working Hours</h4><p>Mon–Sat: 9:00 AM – 8:00 PM<br>Sunday: 10:00 AM – 4:00 PM</p></div></div>\n      </div>\n    </div>\n    <div class=\"contact-form-box\">\n      <div class=\"cf-title\">Send Us a Message</div>\n      <div class=\"form-row\">\n        <div class=\"form-field\"><label>Full Name</label><input type=\"text\" placeholder=\"Your full name\"></div>\n        <div class=\"form-field\"><label>Phone Number</label><input type=\"text\" placeholder=\"+91 XXXXX XXXXX\"></div>\n      </div>\n      <div class=\"form-field\"><label>Email Address</label><input type=\"email\" placeholder=\"your@email.com\"></div>\n      <div class=\"form-field\"><label>Interested In</label>\n        <select>\n          <option>Select a course</option>\n          <option>IBPS PO Complete Course</option>\n          <option>SBI PO / Clerk Course</option>\n          <option>RBI Grade B Preparation</option>\n          <option>Insurance Exams</option>\n          <option>Mock Test Series Only</option>\n        </select>\n      </div>\n      <div class=\"form-field\"><label>Message</label><textarea placeholder=\"Tell us how we can help...\"></textarea></div>\n      <button class=\"cf-submit\"><i class=\"fa fa-paper-plane\"></i> Send Message</button>\n    </div>\n  </div>\n</section>\n\n<!-- FOOTER -->\n<footer>\n  <div class=\"footer-grid\">\n    <div class=\"footer-brand\">\n      <div class=\"fbrand-row\">\n        <svg width=\"40\" height=\"40\" viewBox=\"0 0 48 48\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"24\" cy=\"19\" r=\"16\" stroke=\"#F5C518\" stroke-width=\"2.5\" fill=\"none\"/>\n          <text x=\"19\" y=\"27\" font-family=\"Sora,sans-serif\" font-weight=\"800\" font-size=\"15\" fill=\"white\">K</text>\n          <text x=\"28\" y=\"25\" font-family=\"Sora,sans-serif\" font-weight=\"800\" font-size=\"15\" fill=\"#F5C518\">R</text>\n          <rect x=\"9\" y=\"33\" width=\"9\" height=\"2\" rx=\"1\" fill=\"white\" opacity=\".5\"/>\n          <rect x=\"30\" y=\"33\" width=\"9\" height=\"2\" rx=\"1\" fill=\"white\" opacity=\".5\"/>\n          <line x1=\"24\" y1=\"33\" x2=\"24\" y2=\"46\" stroke=\"#F5C518\" stroke-width=\"1.8\"/>\n          <rect x=\"20\" y=\"42\" width=\"8\" height=\"3\" rx=\".5\" fill=\"#F5C518\"/>\n        </svg>\n        <div>\n          <div style=\"font-family:'Sora',sans-serif;font-size:18px;font-weight:800;color:#fff\">KR <span style=\"color:var(--gold)\">Logics</span></div>\n          <div style=\"font-size:9px;color:rgba(255,255,255,.35);letter-spacing:1.5px;text-transform:uppercase\">Banking Exam Preparation</div>\n        </div>\n      </div>\n      <p>Empowering banking aspirants across India with quality education, expert mentorship and advanced test technology.</p>\n      <div class=\"footer-socials\">\n        <div class=\"fsoc\"><i class=\"fab fa-facebook-f\"></i></div>\n        <div class=\"fsoc\"><i class=\"fab fa-instagram\"></i></div>\n        <div class=\"fsoc\"><i class=\"fab fa-youtube\"></i></div>\n        <div class=\"fsoc\"><i class=\"fab fa-telegram-plane\"></i></div>\n        <div class=\"fsoc\"><i class=\"fab fa-whatsapp\"></i></div>\n      </div>\n    </div>\n    <div class=\"footer-col\">\n      <h5>Courses</h5>\n      <ul>\n        <li><a href=\"#\">IBPS PO / Clerk</a></li>\n        <li><a href=\"#\">SBI PO / Clerk</a></li>\n        <li><a href=\"#\">RBI Grade B</a></li>\n        <li><a href=\"#\">Insurance Exams</a></li>\n        <li><a href=\"#\">Quantitative Aptitude</a></li>\n        <li><a href=\"#\">Reasoning Crash</a></li>\n      </ul>\n    </div>\n    <div class=\"footer-col\">\n      <h5>Quick Links</h5>\n      <ul>\n        <li><a href=\"#\">About Us</a></li>\n        <li><a href=\"#\">Mock Tests</a></li>\n        <li><a href=\"#\">Current Affairs</a></li>\n        <li><a href=\"#\">Blog</a></li>\n        <li><a href=\"#\">Results</a></li>\n        <li><a href=\"#\">Careers</a></li>\n      </ul>\n    </div>\n    <div class=\"footer-col\">\n      <h5>Support</h5>\n      <ul>\n        <li><a href=\"#\">FAQ</a></li>\n        <li><a href=\"#\">Contact Us</a></li>\n        <li><a href=\"#\">Privacy Policy</a></li>\n        <li><a href=\"#\">Terms of Service</a></li>\n        <li><a href=\"#\">Refund Policy</a></li>\n      </ul>\n    </div>\n  </div>\n  <div class=\"footer-bottom\">\n    <p>© 2025 <span>KR Logics</span>. All rights reserved. Made with ❤️ for banking aspirants of India.</p>\n    <p style=\"font-size:11px;color:rgba(255,255,255,.2)\">IBPS · SBI · RBI · Insurance · Competitive Exams</p>\n  </div>\n</footer>"

const videoItems = [
  { id: "iYNfyGVuz-Q", title: "KR Logics banking exam guidance", date: "03 Jun 2026" },
  { id: "aGqR5GiikOI", title: "Exam preparation update", date: "03 Jun 2026" },
  { id: "V2kZHYN9NkY", title: "Banking exam discussion", date: "03 Jun 2026" },
  { id: "f4r_Zn0sk7g", title: "Latest exam guidance", date: "03 Jun 2026" },
  { id: "IVgQiyAM9_Y", title: "Preparation strategy session", date: "03 Jun 2026" },
  { id: "2geYLKUeK9s", title: "Student-focused exam tips", date: "03 Jun 2026" },
  { id: "GENIQ_lQWmk", title: "KR Logics learning update", date: "03 Jun 2026" },
];

const studentStoryVideos = [
  { id: "Uw7mATjJAQY", title: "Student Testimonial", label: "Verified Success Story" },
  { id: "iqtYDE311W0", title: "Student Testimonial", label: "Verified Success Story" },
  { id: "M4vLbNhMTmU", title: "Student Testimonial", label: "Verified Success Story" },
  { id: "rxZFFNB58tw", title: "Student Testimonial", label: "Verified Success Story" },
  { id: "xk5JzE9vEzU", title: "Student Testimonial", label: "Verified Success Story" },
];

const repeatedStudentStoryVideos = [...studentStoryVideos, ...studentStoryVideos, ...studentStoryVideos];

const aboutVideoMarkup = `<div class="about-video-card">
  <iframe
    src="https://www.youtube.com/embed/y--mLNQ14Co?rel=0"
    title="KR Logics introduction video"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>`;

const heroShowcaseMarkup = `<div class="hero-showcase-stack">
  <div class="hero-quick-grid">
    <div class="hero-quick-card">
      <h3>Popular Products</h3>
      <div class="hero-icon-row">
        <a href="/courses" class="hero-product"><span class="hero-product-icon orange"><i class="fa fa-file-pdf"></i></span><b>PDF Course</b></a>
        <a href="/mock-tests" class="hero-product"><span class="hero-product-icon violet"><i class="fa fa-clipboard-check"></i></span><b>Mock Tests</b></a>
        <a href="/courses" class="hero-product"><span class="hero-product-icon purple"><i class="fa fa-crown"></i></span><b>GOAT</b></a>
        <a href="/courses" class="hero-product"><span class="hero-product-icon teal"><i class="fa fa-file-lines"></i></span><b>Super Plan</b></a>
      </div>
    </div>
    <div class="hero-quick-card">
      <h3>Imp Materials</h3>
      <div class="hero-icon-row">
        <a href="/mock-tests" class="hero-product"><span class="hero-product-icon pink"><i class="fa fa-gift"></i></span><b>Smart Quiz</b></a>
        <a href="/courses" class="hero-product"><span class="hero-product-icon teal"><i class="fa fa-book-open"></i></span><b>Study Notes</b></a>
        <a href="/mock-tests" class="hero-product"><span class="hero-product-icon violet"><i class="fa fa-clipboard-list"></i></span><b>Live Test</b></a>
        <a href="/courses" class="hero-product"><span class="hero-product-icon red"><i class="fa fa-file-arrow-down"></i></span><b>Free PDF</b></a>
      </div>
    </div>
  </div>
  <div class="hero-admin-ad-slider" aria-label="Admin advertisement banner">
    <div class="hero-ad-track">
      <a href="/courses" class="hero-ad-slide">
        <span>Admin Ad Banner</span>
        <strong>Bank Foundation Batch 2026</strong>
        <em>Promote courses, offers, events and live batches from admin panel.</em>
        <b>Explore Now</b>
      </a>
      <a href="/mock-tests" class="hero-ad-slide alt">
        <span>Mock Test Offer</span>
        <strong>Practice Like Real Exam</strong>
        <em>Add discount banners, test series ads and limited-time offers here.</em>
        <b>Start Test</b>
      </a>
      <a href="/live-classes" class="hero-ad-slide dark">
        <span>Live Class Update</span>
        <strong>Daily Banking Classes</strong>
        <em>Use this space for announcement banners and upcoming class schedules.</em>
        <b>Join Class</b>
      </a>
    </div>
  </div>
  <div class="hero-bottom-grid">
    <div class="hero-exams-card">
      <div class="hero-card-head"><h3>Upcoming Exams</h3><a href="/mock-tests">View More</a></div>
      <div class="hero-exam-list">
        <a href="/mock-tests" class="hero-exam"><span class="hero-exam-icon bank">RBI</span><b>RBI Assistant</b></a>
        <a href="/mock-tests" class="hero-exam"><span class="hero-exam-icon office">RBI</span><b>RBI Office</b></a>
        <a href="/mock-tests" class="hero-exam"><span class="hero-exam-icon sbi">SBI</span><b>SBI PO</b></a>
        <a href="/mock-tests" class="hero-exam"><span class="hero-exam-icon ibps">IBPS</span><b>IBPS PO</b></a>
      </div>
    </div>
    <a href="/courses" class="hero-banner-card">
      <span>Bank Foundation Batch 2026</span>
      <strong>Har Ghar Banker</strong>
      <em>One access. Unlimited prep.</em>
      <b>₹1399</b>
    </a>
  </div>
</div>`;

const trendingStripMarkup = `<section class="trending-strip" aria-label="Trending links">
  <strong>Trending Links:</strong>
  <div class="trending-marquee">
    <div class="trending-track">
      <a href="/mock-tests">RBI Assistant Notification</a><span>|</span>
      <a href="/mock-tests">SBI CBO Notification</a><span>|</span>
      <a href="/mock-tests">OICL AO Mock Tests</a><span>|</span>
      <a href="/courses">IBPS PO Complete Course</a><span>|</span>
      <a href="/courses">Daily Banking Current Affairs</a><span>|</span>
      <a href="/mock-tests">KR Logics Free Mock Tests</a><span>|</span>
      <a href="/courses">Bank Foundation Batch 2026</a><span>|</span>
      <a href="/mock-tests">RBI Assistant Notification</a><span>|</span>
      <a href="/mock-tests">SBI CBO Notification</a><span>|</span>
      <a href="/mock-tests">OICL AO Mock Tests</a><span>|</span>
      <a href="/courses">IBPS PO Complete Course</a><span>|</span>
      <a href="/courses">Daily Banking Current Affairs</a><span>|</span>
      <a href="/mock-tests">KR Logics Free Mock Tests</a><span>|</span>
      <a href="/courses">Bank Foundation Batch 2026</a><span>|</span>
    </div>
  </div>
</section>`;

const whyKrLogicsMarkup = `<section class="why-kr-section">
  <div class="why-kr-head">
    <h2>Why KR Logics?</h2>
    <p>At KR Logics, our mission is to guide banking aspirants with expert content, smart practice tools, and mentorship that keeps every student moving toward selection.</p>
  </div>
  <div class="why-kr-grid">
    <div class="why-kr-card">
      <div class="why-kr-icon"><i class="fa fa-book-open-reader"></i></div>
      <h3>High Quality Study Material Curated by Experts</h3>
      <p>Mock tests, PDFs, eBooks, notes and video lessons are prepared around the latest banking exam pattern by experienced faculty.</p>
    </div>
    <div class="why-kr-card">
      <div class="why-kr-icon"><i class="fa fa-display"></i></div>
      <h3>Defined All-in-One Course Package with Video Series</h3>
      <p>Get structured courses for SBI, IBPS, RBI and insurance exams with recorded classes, live tests and revision material in one place.</p>
    </div>
    <div class="why-kr-card">
      <div class="why-kr-icon"><i class="fa fa-user-tie"></i></div>
      <h3>Career Guidance &amp; Personal Mentorship</h3>
      <p>Our mentors help students build a practical study plan, analyze weak areas and stay consistent throughout the preparation journey.</p>
    </div>
    <div class="why-kr-card">
      <div class="why-kr-icon"><i class="fa fa-chalkboard-user"></i></div>
      <h3>Highly Experienced Faculty</h3>
      <p>Learn from subject experts who have helped banking aspirants improve accuracy, speed and confidence for competitive exams.</p>
    </div>
  </div>
</section>`;

const brandStyles = `
.kr-logics-reference-home {
  --navy: #050808;
  --navy2: #151a18;
  --navy3: #000303;
  --gold: #ffd21f;
  --gold2: #ffc400;
  --gold3: #fff8d6;
  --light: #f7f6ef;
  --light2: #ece9dc;
  --border: #ded9c8;
  --text: #151515;
  background: #f7f6ef;
}
.kr-logics-reference-home > div > header {
  display: none !important;
}
.kr-logics-reference-home header {
  background: rgba(5, 8, 8, 0.96);
  border-bottom-color: rgba(255, 210, 31, 0.28);
}
.kr-logics-reference-home .logo-wrap svg,
.kr-logics-reference-home .fbrand-row svg {
  display: none;
}
.kr-logics-reference-home .logo-wrap::before,
.kr-logics-reference-home .fbrand-row::before {
  content: "";
  display: block;
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  border-radius: 50%;
  background: url("/logics-logo.jpeg") center / cover no-repeat;
  box-shadow: 0 0 0 2px rgba(255, 210, 31, 0.35), 0 10px 28px rgba(0, 0, 0, 0.22);
}
.kr-logics-reference-home .fbrand-row::before {
  width: 48px;
  height: 48px;
  flex-basis: 48px;
}
.kr-logics-reference-home .logo-text-group .brand,
.kr-logics-reference-home .logo-text-group .brand span,
.kr-logics-reference-home nav a,
.kr-logics-reference-home .exam-menu-trigger {
  color: #ffffff;
}
.kr-logics-reference-home .logo-text-group .tagline,
.kr-logics-reference-home nav a:hover,
.kr-logics-reference-home .exam-menu-trigger:hover {
  color: var(--gold);
}
.kr-logics-reference-home .btn-ghost {
  border-color: var(--gold);
  color: var(--gold);
}
.kr-logics-reference-home .btn-ghost:hover {
  background: var(--gold);
  color: #050808;
}
.kr-logics-reference-home .btn-primary,
.kr-logics-reference-home .hero-btn-main,
.kr-logics-reference-home .mock-nav .next,
.kr-logics-reference-home .cf-submit {
  background: var(--gold);
  color: #050808;
}
.kr-logics-reference-home .btn-primary:hover,
.kr-logics-reference-home .hero-btn-main:hover,
.kr-logics-reference-home .mock-nav .next:hover,
.kr-logics-reference-home .cf-submit:hover {
  background: #ffe164;
  color: #050808;
}
.kr-logics-reference-home .hero {
  background:
    radial-gradient(circle at 75% 18%, rgba(255, 210, 31, 0.20), transparent 28%),
    linear-gradient(135deg, #050808 0%, #101211 56%, #f7f6ef 56%, #f7f6ef 100%);
  min-height: 760px;
  padding-top: 70px;
  padding-bottom: 52px;
}
.kr-logics-reference-home .hero-inner {
  grid-template-columns: minmax(320px, 0.82fr) minmax(620px, 1.18fr);
  gap: 34px;
}
.kr-logics-reference-home .hero h1,
.kr-logics-reference-home .hero-p,
.kr-logics-reference-home .hero-stats small {
  color: #ffffff;
}
.kr-logics-reference-home .hero h1 em,
.kr-logics-reference-home .hstat strong,
.kr-logics-reference-home .sec-eyebrow,
.kr-logics-reference-home .testi-stars,
.kr-logics-reference-home .footer-bottom span {
  color: var(--gold);
}
.kr-logics-reference-home .hero-badge,
.kr-logics-reference-home .chip,
.kr-logics-reference-home .hero-card,
.kr-logics-reference-home .mini-card-light {
  border-color: rgba(255, 210, 31, 0.25);
}
.kr-logics-reference-home .hero-btn-sec,
.kr-logics-reference-home .mock-cta {
  background: #050808;
  border-color: var(--gold);
  color: var(--gold);
}
.kr-logics-reference-home .exam-mega .exam-cat,
.kr-logics-reference-home .exam-mega .exam-link {
  background: #ffffff !important;
  color: #050808 !important;
  border-color: #ded9c8 !important;
}
.kr-logics-reference-home .exam-mega .exam-cat.active {
  background: #fff8dc !important;
  border-color: rgba(255, 210, 31, 0.45) !important;
}
.kr-logics-reference-home .exam-mega .exam-link:hover {
  color: #050808 !important;
  border-color: #050808 !important;
}
.kr-logics-reference-home .hero-card,
.kr-logics-reference-home .mini-card-light,
.kr-logics-reference-home .course-card,
.kr-logics-reference-home .faculty-card,
.kr-logics-reference-home .contact-form-box,
.kr-logics-reference-home .c-card,
.kr-logics-reference-home .faq-item {
  box-shadow: 0 14px 36px rgba(5, 8, 8, 0.08);
}
.kr-logics-reference-home .about-main-card,
.kr-logics-reference-home .mini-card-dark,
.kr-logics-reference-home .testi-section,
.kr-logics-reference-home footer {
  background: #050808;
}
.kr-logics-reference-home .hero-right {
  align-items: stretch;
  justify-content: center;
  min-height: auto;
  padding-bottom: 0;
  position: relative;
  width: 100%;
}
.kr-logics-reference-home .hero-right > .hero-card,
.kr-logics-reference-home .hero-right > .mini-cards {
  display: none;
}
.kr-logics-reference-home .hero-right::before {
  content: none;
  display: none;
}
.kr-logics-reference-home .hero-showcase-stack {
  display: grid;
  gap: 20px;
  width: 100%;
}
.kr-logics-reference-home .hero-quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.kr-logics-reference-home .hero-quick-card,
.kr-logics-reference-home .hero-exams-card {
  background: #ffffff;
  border: 1px solid #ded9c8;
  border-radius: 22px;
  box-shadow: 0 20px 45px rgba(5, 8, 8, 0.16);
  padding: 20px 18px;
}
.kr-logics-reference-home .hero-quick-card {
  background:
    linear-gradient(135deg, rgba(255, 248, 214, 0.96), rgba(255, 216, 77, 0.92)),
    #ffd84d;
  border-color: rgba(5, 8, 8, 0.12);
  box-shadow: 0 20px 45px rgba(159, 115, 0, 0.22);
}
.kr-logics-reference-home .hero-quick-card h3,
.kr-logics-reference-home .hero-card-head h3 {
  color: #252525;
  font-size: 16px;
  font-weight: 800;
}
.kr-logics-reference-home .hero-quick-card h3 {
  color: #050808;
}
.kr-logics-reference-home .hero-icon-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}
.kr-logics-reference-home .hero-product {
  color: #2a2a2a;
  display: grid;
  font-size: 12px;
  font-weight: 800;
  gap: 9px;
  justify-items: center;
  text-align: center;
}
.kr-logics-reference-home .hero-quick-card .hero-product {
  color: #050808;
}
.kr-logics-reference-home .hero-product-icon {
  border-radius: 12px;
  display: grid;
  font-size: 22px;
  height: 54px;
  place-items: center;
  width: 54px;
}
.kr-logics-reference-home .hero-quick-card .hero-product-icon {
  background: rgba(5, 8, 8, 0.88);
  color: #ffd84d;
  box-shadow: 0 10px 22px rgba(5, 8, 8, 0.18);
}
.kr-logics-reference-home .hero-product-icon.orange,
.kr-logics-reference-home .hero-product-icon.violet,
.kr-logics-reference-home .hero-product-icon.purple,
.kr-logics-reference-home .hero-product-icon.teal,
.kr-logics-reference-home .hero-product-icon.pink,
.kr-logics-reference-home .hero-product-icon.red {
  background: rgba(5, 8, 8, 0.88);
  color: #ffd84d;
}
.kr-logics-reference-home .hero-admin-ad-slider {
  border-radius: 20px;
  box-shadow: 0 20px 45px rgba(5, 8, 8, 0.16);
  height: 164px;
  overflow: hidden;
  position: relative;
}
.kr-logics-reference-home .hero-ad-track {
  animation: heroAdSlide 12s infinite;
  display: flex;
  height: 100%;
  width: 300%;
}
.kr-logics-reference-home .hero-ad-slide {
  background:
    radial-gradient(circle at 88% 22%, rgba(255, 210, 31, 0.32), transparent 24%),
    linear-gradient(120deg, #071c4f 0%, #0f63c7 58%, #0aa9de 100%);
  color: #ffffff;
  display: flex;
  flex: 0 0 33.333%;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 24px 30px;
  position: relative;
}
.kr-logics-reference-home .hero-ad-slide::after {
  content: "";
  position: absolute;
  inset: 18px 26px 18px auto;
  width: 190px;
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04)),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.20) 0 2px, transparent 2px 20px);
}
.kr-logics-reference-home .hero-ad-slide.alt {
  background:
    radial-gradient(circle at 88% 20%, rgba(255, 255, 255, 0.22), transparent 24%),
    linear-gradient(120deg, #49006d 0%, #b50a91 58%, #f04b9b 100%);
}
.kr-logics-reference-home .hero-ad-slide.dark {
  background:
    radial-gradient(circle at 88% 20%, rgba(255, 210, 31, 0.24), transparent 24%),
    linear-gradient(120deg, #050808 0%, #27312b 58%, #80711a 100%);
}
.kr-logics-reference-home .hero-ad-slide span,
.kr-logics-reference-home .hero-ad-slide strong,
.kr-logics-reference-home .hero-ad-slide em,
.kr-logics-reference-home .hero-ad-slide b {
  position: relative;
  z-index: 1;
}
.kr-logics-reference-home .hero-ad-slide span {
  color: #ffd21f;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}
.kr-logics-reference-home .hero-ad-slide strong {
  font-family: "Sora", sans-serif;
  font-size: clamp(25px, 3.2vw, 38px);
  line-height: 1.05;
  margin-top: 7px;
}
.kr-logics-reference-home .hero-ad-slide em {
  color: rgba(255, 255, 255, 0.86);
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5;
  margin-top: 8px;
  max-width: 560px;
}
.kr-logics-reference-home .hero-ad-slide b {
  align-self: flex-start;
  background: #ffd21f;
  border-radius: 999px;
  color: #050808;
  font-size: 12px;
  font-weight: 900;
  margin-top: 12px;
  padding: 7px 14px;
}
@keyframes heroAdSlide {
  0%, 28% { transform: translateX(0); }
  34%, 62% { transform: translateX(-33.333%); }
  68%, 95% { transform: translateX(-66.666%); }
  100% { transform: translateX(0); }
}
.kr-logics-reference-home .hero-bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  gap: 20px;
}
.kr-logics-reference-home .hero-card-head {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 14px;
}
.kr-logics-reference-home .hero-card-head a {
  color: #9a008e;
  font-size: 13px;
  font-weight: 900;
  white-space: nowrap;
}
.kr-logics-reference-home .hero-exam-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-top: 20px;
}
.kr-logics-reference-home .hero-exam {
  align-items: center;
  background: #ffffff;
  border: 1px solid #e1dfd5;
  border-radius: 16px;
  box-shadow: 0 8px 22px rgba(5, 8, 8, 0.07);
  color: #242424;
  display: grid;
  font-size: 12px;
  font-weight: 900;
  gap: 10px;
  justify-items: center;
  min-height: 116px;
  padding: 12px;
  text-align: center;
}
.kr-logics-reference-home .hero-exam-icon {
  border-radius: 50%;
  color: #ffffff;
  display: grid;
  font-size: 11px;
  font-weight: 900;
  height: 52px;
  place-items: center;
  width: 52px;
}
.kr-logics-reference-home .hero-exam-icon.bank { background: #111111; color: #ffd21f; }
.kr-logics-reference-home .hero-exam-icon.office { background: #c8aa62; color: #101010; }
.kr-logics-reference-home .hero-exam-icon.sbi { background: #0cb4e8; }
.kr-logics-reference-home .hero-exam-icon.ibps { background: #4f6ef7; }
.kr-logics-reference-home .hero-banner-card {
  background:
    linear-gradient(120deg, rgba(7, 42, 120, 0.94), rgba(24, 105, 198, 0.86)),
    url("/banking-mock-test-hero.png") center / cover no-repeat;
  border-radius: 18px;
  box-shadow: 0 20px 45px rgba(5, 8, 8, 0.18);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 210px;
  overflow: hidden;
  padding: 24px;
  position: relative;
}
.kr-logics-reference-home .hero-banner-card::after {
  content: "";
  position: absolute;
  inset: auto -35px -50px auto;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(255, 210, 31, 0.22);
}
.kr-logics-reference-home .hero-banner-card span,
.kr-logics-reference-home .hero-banner-card strong,
.kr-logics-reference-home .hero-banner-card em,
.kr-logics-reference-home .hero-banner-card b {
  position: relative;
  z-index: 1;
}
.kr-logics-reference-home .hero-banner-card span {
  color: #ffd21f;
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}
.kr-logics-reference-home .hero-banner-card strong {
  font-family: "Sora", sans-serif;
  font-size: clamp(32px, 4vw, 54px);
  line-height: 0.95;
  margin-top: 8px;
  text-transform: uppercase;
}
.kr-logics-reference-home .hero-banner-card em {
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
  margin-top: 12px;
}
.kr-logics-reference-home .hero-banner-card b {
  align-self: flex-start;
  background: #ffd21f;
  border-radius: 999px;
  color: #050808;
  font-family: "Sora", sans-serif;
  font-size: 24px;
  margin-top: 14px;
  padding: 7px 18px;
}
.kr-logics-reference-home .trending-strip {
  align-items: center;
  background: linear-gradient(90deg, #f7c600 0%, #ffd84d 48%, #f5b800 100%);
  border-bottom: 1px solid rgba(5, 8, 8, 0.16);
  border-top: 1px solid rgba(5, 8, 8, 0.16);
  display: flex;
  gap: 18px;
  overflow: hidden;
  padding: 10px 5%;
}
.kr-logics-reference-home .trending-strip strong {
  color: #050808;
  flex: 0 0 auto;
  font-size: 15px;
  font-weight: 900;
}
.kr-logics-reference-home .trending-marquee {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
.kr-logics-reference-home .trending-track {
  animation: trendMove 24s linear infinite;
  display: inline-flex;
  gap: 14px;
  min-width: max-content;
  white-space: nowrap;
}
.kr-logics-reference-home .trending-track a {
  color: #050808;
  font-size: 15px;
  font-weight: 800;
}
.kr-logics-reference-home .trending-track span {
  color: #050808;
  opacity: 0.7;
}
@keyframes trendMove {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.kr-logics-reference-home .why-kr-section {
  background: #f8f8f8;
  border-bottom: 1px solid #ded9c8;
  border-top: 1px solid #ded9c8;
  padding: 52px 5% 64px;
  text-align: center;
}
.kr-logics-reference-home .why-kr-head h2 {
  color: #101215;
  font-family: "Sora", sans-serif;
  font-size: clamp(28px, 3.2vw, 38px);
  font-weight: 800;
  letter-spacing: 0;
}
.kr-logics-reference-home .why-kr-head p {
  color: #323232;
  font-size: 15px;
  line-height: 1.8;
  margin: 12px auto 0;
  max-width: 780px;
}
.kr-logics-reference-home .why-kr-grid {
  display: grid;
  gap: 34px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 34px auto 0;
  max-width: 1220px;
}
.kr-logics-reference-home .why-kr-card {
  align-items: center;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.kr-logics-reference-home .why-kr-icon {
  align-items: center;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 12px 28px rgba(5, 8, 8, 0.10);
  color: #d4a017;
  display: flex;
  font-size: 42px;
  height: 120px;
  justify-content: center;
  margin-bottom: 28px;
  width: 120px;
}
.kr-logics-reference-home .why-kr-card h3 {
  color: #121212;
  font-size: 17px;
  font-weight: 900;
  line-height: 1.25;
  max-width: 270px;
}
.kr-logics-reference-home .why-kr-card p {
  color: #363646;
  font-size: 15px;
  line-height: 1.65;
  margin-top: 14px;
  max-width: 280px;
}
.kr-logics-reference-home .faculty-section .faculty-card {
  background: #ffffff;
}
.kr-logics-reference-home .faculty-section .faculty-top {
  height: 230px;
  overflow: hidden;
  padding: 0;
  position: relative;
}
.kr-logics-reference-home .faculty-section .faculty-top::before {
  background-position: center top;
  background-size: cover;
  content: "";
  display: block;
  height: 100%;
  transition: transform 0.35s ease;
  width: 100%;
}
.kr-logics-reference-home .faculty-section .faculty-card:hover .faculty-top::before {
  transform: scale(1.05);
}
.kr-logics-reference-home .faculty-section .faculty-card:nth-child(1) .faculty-top::before {
  background-image: url("https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=520&q=80");
}
.kr-logics-reference-home .faculty-section .faculty-card:nth-child(2) .faculty-top::before {
  background-image: url("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=520&q=80");
}
.kr-logics-reference-home .faculty-section .faculty-card:nth-child(3) .faculty-top::before {
  background-image: url("https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=520&q=80");
}
.kr-logics-reference-home .faculty-section .faculty-card:nth-child(4) .faculty-top::before {
  background-image: url("https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=520&q=80");
}
.kr-logics-reference-home .faculty-section .faculty-avatar {
  display: none;
}
.kr-logics-reference-home .faculty-section .faculty-body {
  padding: 22px 16px 24px;
}
.kr-logics-reference-home .about-grid {
  grid-template-columns: minmax(340px, 1.05fr) minmax(320px, 0.95fr);
  align-items: center;
}
.kr-logics-reference-home .about-grid::before {
  content: none;
  display: none;
}
.kr-logics-reference-home .about-video-card {
  grid-column: 1;
  grid-row: 1;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 30px 110px 30px 110px;
  background: #050808;
  box-shadow: 0 24px 70px rgba(5, 8, 8, 0.18);
}
.kr-logics-reference-home .about-video-card iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
.kr-logics-reference-home .about-grid > div:nth-child(2) {
  display: none;
}
.kr-logics-reference-home .about-grid > div:nth-child(3) {
  grid-column: 2;
  grid-row: 1;
}
.kr-logics-reference-home .about-main-card {
  display: none;
}
.kr-logics-reference-home .videos-section {
  position: relative;
  overflow: hidden;
  padding: 18px 5% 44px;
  min-height: 548px;
  background: #f6f2e8;
}
.kr-logics-reference-home .videos-section::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(255, 255, 255, 0.84);
  pointer-events: none;
}
.kr-logics-reference-home .videos-bg-grid {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  padding: 8px;
  z-index: 0;
  opacity: 0.18;
  pointer-events: none;
}
.kr-logics-reference-home .videos-bg-tile {
  min-height: 92px;
  border-radius: 7px;
  background: var(--thumb) center / cover no-repeat;
  filter: saturate(0.68) contrast(0.92);
}
.kr-logics-reference-home .videos-inner {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
}
.kr-logics-reference-home .videos-title {
  font-family: "Sora", sans-serif;
  font-size: clamp(38px, 4.8vw, 58px);
  line-height: 1;
  font-weight: 800;
  color: #101215;
  letter-spacing: -0.5px;
}
.kr-logics-reference-home .videos-sub {
  max-width: 760px;
  margin: 12px auto 0;
  color: #596273;
  font-size: 17px;
  line-height: 1.68;
  font-weight: 500;
}
.kr-logics-reference-home .video-stage {
  position: relative;
  min-height: 382px;
  margin-top: 28px;
}
.kr-logics-reference-home .video-card {
  position: absolute;
  top: 50%;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(5, 8, 8, 0.08);
  background: #111;
  box-shadow: 0 24px 60px rgba(5, 8, 8, 0.16);
  display: block;
  border: 0;
  padding: 0;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease, filter 0.25s ease;
}
.kr-logics-reference-home .video-card:hover {
  box-shadow: 0 30px 72px rgba(5, 8, 8, 0.22);
}
.kr-logics-reference-home .video-card.featured {
  left: 50%;
  z-index: 3;
  width: min(610px, 52vw);
  height: 346px;
  transform: translate(-50%, -50%);
  box-shadow: 0 32px 80px rgba(5, 8, 8, 0.22);
}
.kr-logics-reference-home .video-card.featured:hover {
  transform: translate(-50%, calc(-50% - 4px));
}
.kr-logics-reference-home .video-card.side {
  z-index: 2;
  width: min(470px, 38vw);
  height: 232px;
  opacity: 0.42;
  filter: saturate(0.72);
}
.kr-logics-reference-home .video-card.side.left {
  left: 8%;
  transform: translateY(-46%);
}
.kr-logics-reference-home .video-card.side.right {
  right: 8%;
  transform: translateY(-46%);
}
.kr-logics-reference-home .video-card.side:hover {
  opacity: 0.86;
}
.kr-logics-reference-home .video-thumb {
  position: absolute;
  inset: 0;
  background: var(--thumb) center / cover no-repeat;
  transform: scale(1.02);
}
.kr-logics-reference-home .video-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(5, 8, 8, 0.08), rgba(5, 8, 8, 0.76));
}
.kr-logics-reference-home .video-card.side::after {
  background: rgba(255, 255, 255, 0.36);
}
.kr-logics-reference-home .video-play {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 45%;
  display: grid;
  width: 62px;
  height: 62px;
  place-items: center;
  border-radius: 50%;
  background: #ffffff;
  color: #e11d1d;
  transform: translate(-50%, -50%);
  box-shadow: 0 10px 26px rgba(5, 8, 8, 0.22);
}
.kr-logics-reference-home .video-play i {
  margin-left: 4px;
  font-size: 21px;
}
.kr-logics-reference-home .video-caption {
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 18px 20px;
  text-align: left;
  color: #fff;
}
.kr-logics-reference-home .video-card.featured .video-caption {
  padding: 0;
  overflow: hidden;
  border-radius: 0 0 8px 8px;
}
.kr-logics-reference-home .video-card.side .video-caption {
  display: none;
}
.kr-logics-reference-home .video-caption span {
  display: inline-flex;
  margin-bottom: 7px;
  border-radius: 999px;
  background: rgba(255, 210, 31, 0.92);
  padding: 4px 10px;
  color: #050808;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.9px;
  text-transform: uppercase;
}
.kr-logics-reference-home .video-caption h3 {
  font-family: "Sora", sans-serif;
  font-size: 18px;
  line-height: 1.35;
  font-weight: 800;
}
.kr-logics-reference-home .featured-title-bar {
  background: #e72a18;
  padding: 13px 22px;
  font-family: "Sora", sans-serif;
  font-size: 17px;
  font-weight: 800;
}
.kr-logics-reference-home .featured-date {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  padding: 10px 22px 12px;
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
}
.kr-logics-reference-home .featured-date i {
  color: #e72a18;
}
.kr-logics-reference-home .video-arrow {
  position: absolute;
  z-index: 4;
  top: 50%;
  display: grid;
  width: 50px;
  height: 50px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: #ffffff;
  color: #e72a18;
  box-shadow: 0 14px 32px rgba(5, 8, 8, 0.15);
  transform: translateY(-50%);
  cursor: pointer;
}
.kr-logics-reference-home .video-arrow.left {
  left: 8%;
}
.kr-logics-reference-home .video-arrow.right {
  right: 8%;
}
.kr-logics-reference-home .video-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 32px;
  background: rgba(0, 0, 0, 0.62);
  backdrop-filter: blur(9px);
}
.kr-logics-reference-home .video-modal-panel {
  position: relative;
  width: min(920px, 92vw);
  aspect-ratio: 16 / 9;
  background: #050808;
  box-shadow: 0 35px 100px rgba(0, 0, 0, 0.45);
}
.kr-logics-reference-home .video-modal-panel iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
.kr-logics-reference-home .video-modal-close {
  position: absolute;
  right: -18px;
  top: -18px;
  z-index: 2;
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: #ffffff;
  color: #e72a18;
  cursor: pointer;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
}
.kr-logics-reference-home .student-videos-section {
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 0%, rgba(231, 42, 24, 0.06), transparent 42%),
    #ffffff;
  padding: 64px 30px 68px;
}
.kr-logics-reference-home .student-videos-head {
  text-align: center;
}
.kr-logics-reference-home .student-videos-title {
  font-family: "Sora", sans-serif;
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.4px;
}
.kr-logics-reference-home .student-videos-title span {
  color: #e72a18;
}
.kr-logics-reference-home .student-videos-sub {
  margin-top: 12px;
  color: #667085;
  font-size: 14px;
  font-weight: 600;
}
.kr-logics-reference-home .student-videos-sub b {
  color: #e72a18;
}
.kr-logics-reference-home .student-video-row {
  margin-top: 40px;
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 0 0 10px;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  scroll-behavior: smooth;
}
.kr-logics-reference-home .student-video-row::-webkit-scrollbar {
  display: none;
}
.kr-logics-reference-home .student-video-card {
  position: relative;
  flex: 0 0 calc((100vw - 60px - 70px) / 6);
  min-width: 0;
  height: 360px;
  overflow: hidden;
  border: 0;
  border-radius: 18px;
  padding: 0;
  background: #111;
  color: #ffffff;
  cursor: pointer;
  scroll-snap-align: start;
  box-shadow: 0 18px 42px rgba(5, 8, 8, 0.12);
}
.kr-logics-reference-home .student-video-wrap {
  position: relative;
}
.kr-logics-reference-home .student-video-arrow {
  position: absolute;
  z-index: 5;
  top: 50%;
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: #ffffff;
  color: #e72a18;
  cursor: pointer;
  box-shadow: 0 16px 36px rgba(5, 8, 8, 0.18);
  transform: translateY(-50%);
}
.kr-logics-reference-home .student-video-arrow.left {
  left: 8px;
}
.kr-logics-reference-home .student-video-arrow.right {
  right: 8px;
}
.kr-logics-reference-home .student-video-thumb {
  position: absolute;
  inset: 0;
  background: var(--thumb) center / cover no-repeat;
}
.kr-logics-reference-home .student-video-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.88));
}
.kr-logics-reference-home .student-badge {
  position: absolute;
  z-index: 2;
  left: 18px;
  top: 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.46);
  background: rgba(255, 255, 255, 0.16);
  padding: 7px 12px;
  font-size: 10px;
  font-weight: 800;
}
.kr-logics-reference-home .student-play {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 48%;
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.76);
  color: #ffffff;
  transform: translate(-50%, -50%);
}
.kr-logics-reference-home .student-play i {
  margin-left: 4px;
  color: #ffffff;
  font-size: 20px;
}
.kr-logics-reference-home .student-caption {
  position: absolute;
  z-index: 2;
  left: 16px;
  right: 16px;
  bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  background: rgba(27, 27, 27, 0.82);
  padding: 13px 15px;
  text-align: left;
}
.kr-logics-reference-home .student-caption small {
  display: block;
  color: #ffb4ac;
  font-size: 10px;
  font-weight: 800;
}
.kr-logics-reference-home .student-caption strong {
  display: block;
  margin-top: 8px;
  font-size: 15px;
  font-weight: 800;
}
.kr-logics-reference-home .student-caption span {
  display: block;
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 11px;
  font-weight: 700;
}
@media (max-width: 1180px) {
  .kr-logics-reference-home .hero {
    background:
      radial-gradient(circle at 80% 0%, rgba(255, 210, 31, 0.18), transparent 34%),
      #050808;
  }
  .kr-logics-reference-home .hero-inner {
    grid-template-columns: 1fr;
  }
  .kr-logics-reference-home .hero-right {
    min-height: auto;
    margin-top: 20px;
  }
  .kr-logics-reference-home .hero-bottom-grid {
    grid-template-columns: 1fr;
  }
  .kr-logics-reference-home .about-grid::before {
    max-width: 760px;
    margin: 0;
  }
  .kr-logics-reference-home .about-video-card {
    max-width: 760px;
    margin: 0;
  }
}
@media (min-width: 901px) {
  .kr-logics-reference-home .about-grid {
    grid-template-columns: minmax(360px, 1.05fr) minmax(320px, 0.95fr) !important;
  }
  .kr-logics-reference-home .about-grid::before {
    grid-column: 1 !important;
    grid-row: 1 !important;
  }
  .kr-logics-reference-home .about-video-card {
    grid-column: 1 !important;
    grid-row: 1 !important;
  }
  .kr-logics-reference-home .about-grid > div:nth-child(3) {
    grid-column: 2 !important;
    grid-row: 1 !important;
  }
}
@media (max-width: 980px) {
  .kr-logics-reference-home .why-kr-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .kr-logics-reference-home .video-stage {
    min-height: 360px;
  }
  .kr-logics-reference-home .video-card.featured {
    width: min(640px, 86vw);
    height: 315px;
  }
  .kr-logics-reference-home .video-card.side {
    display: none;
  }
  .kr-logics-reference-home .student-video-card {
    flex-basis: calc((100vw - 60px - 28px) / 3);
    height: 340px;
  }
}
@media (max-width: 640px) {
  .kr-logics-reference-home .hero {
    padding-top: 44px;
    padding-bottom: 34px;
  }
  .kr-logics-reference-home .hero-quick-grid,
  .kr-logics-reference-home .hero-bottom-grid {
    grid-template-columns: 1fr;
  }
  .kr-logics-reference-home .hero-icon-row,
  .kr-logics-reference-home .hero-exam-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .kr-logics-reference-home .hero-banner-card {
    min-height: 230px;
  }
  .kr-logics-reference-home .hero-admin-ad-slider {
    height: 210px;
  }
  .kr-logics-reference-home .hero-ad-slide {
    padding: 22px;
  }
  .kr-logics-reference-home .hero-ad-slide::after {
    display: none;
  }
  .kr-logics-reference-home .trending-strip {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
    padding: 9px 5%;
  }
  .kr-logics-reference-home .trending-track a {
    font-size: 13px;
  }
  .kr-logics-reference-home .why-kr-section {
    padding: 42px 5% 48px;
  }
  .kr-logics-reference-home .why-kr-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  .kr-logics-reference-home .why-kr-icon {
    height: 104px;
    width: 104px;
    font-size: 36px;
    margin-bottom: 20px;
  }
  .kr-logics-reference-home .video-card.featured {
    width: 100%;
    height: 275px;
  }
  .kr-logics-reference-home .video-arrow {
    width: 42px;
    height: 42px;
  }
  .kr-logics-reference-home .video-arrow.left {
    left: -4px;
  }
  .kr-logics-reference-home .video-arrow.right {
    right: -4px;
  }
  .kr-logics-reference-home .student-video-card {
    flex-basis: min(280px, 78vw);
    height: 340px;
  }
  .kr-logics-reference-home .student-video-arrow.right {
    right: 18px;
  }
}
@media (max-width: 900px) {
  .kr-logics-reference-home .about-grid {
    grid-template-columns: 1fr !important;
  }
  .kr-logics-reference-home .about-grid::before,
  .kr-logics-reference-home .about-video-card,
  .kr-logics-reference-home .about-grid > div:nth-child(3) {
    grid-column: auto !important;
    grid-row: auto !important;
  }
}
`;

export default function Home() {
  const mockMarker = "<!-- MOCK TEST -->";
  const faqMarker = "<!-- FAQ -->";
  const heroAboutMarker = '</section>\n\n<div class="divider"></div>\n\n<!-- ABOUT -->';
  const pageWithHeroShowcase = pageMarkup.replace('<div class="hero-right">', `<div class="hero-right">${heroShowcaseMarkup}`);
  const pageWithTrendingStrip = pageWithHeroShowcase.replace(
    heroAboutMarker,
    `</section>\n\n${trendingStripMarkup}\n\n<div class="divider"></div>\n\n<!-- ABOUT -->`,
  );
  const pageWithAboutVideo = pageWithTrendingStrip.replace('<div class="about-grid">', `<div class="about-grid">${aboutVideoMarkup}`);
  const pageWithWhySection = pageWithAboutVideo.replace("<!-- COURSES -->", `${whyKrLogicsMarkup}\n\n<div class="divider"></div>\n\n<!-- COURSES -->`);
  const [beforeMockMarkup, afterMockMarkup = ""] = pageWithWhySection.split(mockMarker);
  const [mockToFaqMarkup, afterFaqMarkup = ""] = `${mockMarker}${afterMockMarkup}`.split(faqMarker);

  const handlePageClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const faqQuestion = target.closest(".faq-q");

    if (faqQuestion instanceof HTMLElement) {
      const item = faqQuestion.parentElement;
      if (!item) return;

      item.parentElement?.querySelectorAll(".faq-item").forEach((faqItem) => {
        if (faqItem !== item) faqItem.classList.remove("open");
      });
      item.classList.toggle("open");
      return;
    }

    const anchor = target.closest('a[href^="#"]');
    if (anchor instanceof HTMLAnchorElement) {
      const section = document.querySelector(anchor.getAttribute("href") || "");
      if (section) {
        event.preventDefault();
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <main className="kr-logics-reference-home" onClick={handlePageClick}>
      <PublicHeader active="home" />
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
      <style dangerouslySetInnerHTML={{ __html: brandStyles }} />
      <div dangerouslySetInnerHTML={{ __html: beforeMockMarkup }} />
      <KRLogicsVideos />
      <div className="divider" />
      <div dangerouslySetInnerHTML={{ __html: mockToFaqMarkup }} />
      <StudentStoryVideos />
      <div dangerouslySetInnerHTML={{ __html: `${faqMarker}${afterFaqMarkup}` }} />
    </main>
  );
}

function KRLogicsVideos() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openVideo, setOpenVideo] = useState<(typeof videoItems)[number] | null>(null);
  const active = videoItems[activeIndex];
  const previous = videoItems[(activeIndex - 1 + videoItems.length) % videoItems.length];
  const next = videoItems[(activeIndex + 1) % videoItems.length];

  const move = (direction: -1 | 1) => {
    setActiveIndex((index) => (index + direction + videoItems.length) % videoItems.length);
  };

  return (
    <section className="videos-section" id="videos">
      <div className="videos-bg-grid" aria-hidden="true">
        {videoItems.concat(videoItems).map((video, index) => (
          <span
            key={`${video.id}-${index}`}
            className="videos-bg-tile"
            style={{ "--thumb": `url('https://img.youtube.com/vi/${video.id}/hqdefault.jpg')` } as CSSProperties}
          />
        ))}
      </div>
      <div className="videos-inner">
        <h2 className="videos-title">KR Logics Videos</h2>
        <p className="videos-sub">
          Stay informed with the latest updates, achievements, and events from the KR Logics learning community, from exam strategy to student success stories.
        </p>
        <div className="video-stage">
          <button type="button" className="video-arrow left" aria-label="Previous video" onClick={() => move(-1)}>
            <i className="fa fa-chevron-left" />
          </button>
          <VideoCard video={previous} variant="side left" onOpen={setOpenVideo} />
          <VideoCard video={active} variant="featured" onOpen={setOpenVideo} />
          <VideoCard video={next} variant="side right" onOpen={setOpenVideo} />
          <button type="button" className="video-arrow right" aria-label="Next video" onClick={() => move(1)}>
            <i className="fa fa-chevron-right" />
          </button>
        </div>
      </div>
      {openVideo && (
        <div className="video-modal" role="dialog" aria-modal="true" aria-label={`${openVideo.title} video`} onClick={() => setOpenVideo(null)}>
          <div className="video-modal-panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="video-modal-close" aria-label="Close video" onClick={() => setOpenVideo(null)}>
              <i className="fa fa-times" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${openVideo.id}?autoplay=1&rel=0`}
              title={openVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}

function StudentStoryVideos() {
  const [openVideo, setOpenVideo] = useState<(typeof studentStoryVideos)[number] | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const scrollVideos = (direction: -1 | 1) => {
    const row = rowRef.current;
    if (!row) return;

    row.scrollBy({ left: direction * Math.max(row.clientWidth * 0.82, 320), behavior: "smooth" });
  };

  return (
    <section className="student-videos-section">
      <div className="student-videos-head">
        <h2 className="student-videos-title">What Our Students Say<span>.</span></h2>
        <p className="student-videos-sub">
          Real stories from students who trusted <b>KR Logics</b> for their banking exam preparation journey.
        </p>
      </div>
      <div className="student-video-wrap">
        <button type="button" className="student-video-arrow left" aria-label="Previous student videos" onClick={() => scrollVideos(-1)}>
          <i className="fa fa-chevron-left" />
        </button>
        <div className="student-video-row" ref={rowRef}>
          {repeatedStudentStoryVideos.map((video, index) => (
            <button
              key={`${video.id}-${index}`}
              type="button"
              className="student-video-card"
              onClick={() => setOpenVideo(video)}
              style={{ "--thumb": `url('https://img.youtube.com/vi/${video.id}/hqdefault.jpg')` } as CSSProperties}
            >
              <div className="student-video-thumb" />
              <div className="student-badge">{video.label}</div>
              <div className="student-play"><i className="fa fa-play" /></div>
              <div className="student-caption">
                <small><i className="fa fa-graduation-cap" /> Admission Journey Shared</small>
                <strong>{video.title}</strong>
                <span>Parent / Student Review</span>
              </div>
            </button>
          ))}
        </div>
        <button type="button" className="student-video-arrow right" aria-label="Next student videos" onClick={() => scrollVideos(1)}>
          <i className="fa fa-chevron-right" />
        </button>
      </div>
      {openVideo && (
        <div className="video-modal" role="dialog" aria-modal="true" aria-label={`${openVideo.title} video`} onClick={() => setOpenVideo(null)}>
          <div className="video-modal-panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="video-modal-close" aria-label="Close video" onClick={() => setOpenVideo(null)}>
              <i className="fa fa-times" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${openVideo.id}?autoplay=1&rel=0`}
              title={openVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}

function VideoCard({ video, variant, onOpen }: { video: (typeof videoItems)[number]; variant: string; onOpen: (video: (typeof videoItems)[number]) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(video)}
      className={`video-card ${variant}`}
      style={{ "--thumb": `url('https://img.youtube.com/vi/${video.id}/hqdefault.jpg')` } as CSSProperties}
    >
      <div className="video-thumb" />
      <div className="video-play"><i className="fa fa-play" /></div>
      <div className="video-caption">
        {variant.includes("featured") ? (
          <>
            <div className="featured-title-bar">KR Logics Video</div>
            <div className="featured-date"><i className="fa fa-clock" /> {video.date}</div>
          </>
        ) : (
          <>
            <span>KR Logics</span>
            <h3>{video.title}</h3>
          </>
        )}
      </div>
    </button>
  );
}
