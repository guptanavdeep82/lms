"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Search, StickyNote, Trash2, X } from "lucide-react";
import {
  createStudentNote,
  deleteStudentNote,
  fetchStudentNotes,
  updateStudentNote,
  type StudentNoteRecord,
} from "@/lib/student-dashboard";
import { StudentSectionCard } from "@/components/student/StudentSectionCard";
import { useStudentEmail } from "@/components/student/useStudentEmail";

const cardAccents = [
  "border-t-[#172a69]",
  "border-t-[#0f9f78]",
  "border-t-[#f0a500]",
  "border-t-[#0957D3]",
];

type NoteFormState = {
  title: string;
  content: string;
};

const emptyForm: NoteFormState = { title: "", content: "" };

export function StudentNotesPanel() {
  const email = useStudentEmail();
  const [notes, setNotes] = useState<StudentNoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<NoteFormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    fetchStudentNotes(email)
      .then(setNotes)
      .finally(() => setLoading(false));
  }, [email]);

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter(
      (note) => note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query),
    );
  }, [notes, search]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setMessage("");
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
  };

  const openEditForm = (note: StudentNoteRecord) => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note.id);
    setShowForm(true);
    setMessage("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;

    setSaving(true);
    setMessage("");

    try {
      if (editingId) {
        const updated = await updateStudentNote({
          email,
          id: editingId,
          title: form.title.trim(),
          content: form.content.trim(),
        });
        if (updated) {
          setNotes((current) => current.map((note) => (note.id === updated.id ? updated : note)));
          resetForm();
          setMessage("Note updated successfully.");
        }
      } else {
        const created = await createStudentNote({
          email,
          title: form.title.trim(),
          content: form.content.trim(),
        });
        if (created) {
          setNotes((current) => [created, ...current]);
          resetForm();
          setMessage("Note added successfully.");
        }
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save note.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!email) return;
    setDeletingId(id);
    setMessage("");

    try {
      await deleteStudentNote(email, id);
      setNotes((current) => current.filter((note) => note.id !== id));
      if (editingId === id) resetForm();
      setMessage("Note deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete note.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 className="animate-spin text-[#172a69]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudentSectionCard eyebrow="Personal" title="My Notes">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7d8799]" />
            <input
              type="search"
              placeholder="Search your notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] pl-10 pr-4 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-[#172a69] px-4 text-xs font-extrabold text-white sm:text-sm"
          >
            <Plus size={16} /> Add Note
          </button>
        </div>

        {showForm ? (
          <form onSubmit={handleSubmit} className="mb-6 rounded-[20px] border border-[#dfe5ef] bg-[#f8fafc] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#172a69]">{editingId ? "Edit Note" : "New Note"}</h3>
              <button type="button" onClick={resetForm} className="grid h-8 w-8 place-items-center rounded-xl border border-[#dfe5ef] bg-white text-[#667085]">
                <X size={16} />
              </button>
            </div>
            <div className="grid gap-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#667085] sm:text-sm">Title</span>
                <input
                  className="h-10 w-full rounded-2xl border border-[#dfe5ef] bg-white px-4 text-sm"
                  value={form.title}
                  onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                  placeholder="e.g. Quant formulas, English rules..."
                  required
                  maxLength={255}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#667085] sm:text-sm">Note</span>
                <textarea
                  className="min-h-[140px] w-full rounded-2xl border border-[#dfe5ef] bg-white px-4 py-3 text-sm"
                  value={form.content}
                  onChange={(e) => setForm((current) => ({ ...current, content: e.target.value }))}
                  placeholder="Write your note here..."
                  required
                  maxLength={10000}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[#172a69] px-4 text-xs font-extrabold text-white disabled:opacity-60 sm:text-sm"
                >
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <StickyNote size={16} />}
                  {editingId ? "Update Note" : "Save Note"}
                </button>
                <button type="button" onClick={resetForm} className="inline-flex h-10 items-center rounded-2xl border border-[#dfe5ef] bg-white px-4 text-xs font-bold text-[#667085] sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : null}

        {message ? <p className="mb-4 text-sm font-semibold text-[#0f9f78]">{message}</p> : null}

        {filteredNotes.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredNotes.map((note, index) => (
              <article
                key={note.id}
                className={`flex flex-col rounded-[20px] border border-[#e5eaf2] border-t-4 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] ${cardAccents[index % cardAccents.length]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-extrabold leading-snug text-[#111827]">{note.title}</h4>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => openEditForm(note)}
                      className="grid h-8 w-8 place-items-center rounded-xl border border-[#dfe5ef] bg-[#f8fafc] text-[#172a69]"
                      aria-label="Edit note"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      disabled={deletingId === note.id}
                      className="grid h-8 w-8 place-items-center rounded-xl border border-[#dfe5ef] bg-[#fff5f5] text-[#c53030] disabled:opacity-60"
                      aria-label="Delete note"
                    >
                      {deletingId === note.id ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
                <p className="mt-3 flex-1 whitespace-pre-wrap text-sm leading-6 text-[#667085]">{note.content}</p>
                <p className="mt-4 text-[11px] font-semibold text-[#9aa4b5]">
                  {note.updated_at
                    ? `Updated ${new Date(note.updated_at).toLocaleString()}`
                    : note.created_at
                      ? `Created ${new Date(note.created_at).toLocaleString()}`
                      : ""}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] border border-dashed border-[#dfe5ef] bg-[#f8fafc] p-8 text-center">
            <StickyNote size={32} className="mx-auto text-[#c7d2e5]" />
            <p className="mt-3 text-sm font-bold text-[#667085]">
              {search.trim() ? "No notes match your search." : "No notes yet. Add your first study note."}
            </p>
            {!search.trim() ? (
              <button
                type="button"
                onClick={openCreateForm}
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-2xl bg-[#172a69] px-4 text-xs font-extrabold text-white sm:text-sm"
              >
                <Plus size={16} /> Add Note
              </button>
            ) : null}
          </div>
        )}
      </StudentSectionCard>
    </div>
  );
}
