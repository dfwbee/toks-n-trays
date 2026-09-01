import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";

const BLANK = { id: "", name: "", category: "pizza", tag: "", img: "", sizes: [{ label: "Medium", price: "" }] };
const BASE_CATEGORIES = ["pizza", "soup", "stew"];

export default function AdminMenuItemForm({ item, existingCategories = [], onSave, onCancel, saving }) {
  const isEdit = !!item;
  const [form, setForm] = useState(
    item
      ? { ...item, sizes: Object.entries(item.sizes).map(([label, price]) => ({ label, price: String(price) })) }
      : BLANK
  );
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const categoryOptions = Array.from(new Set([...BASE_CATEGORIES, ...existingCategories]));

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateSize(index, field, value) {
    setForm((f) => {
      const sizes = [...f.sizes];
      sizes[index] = { ...sizes[index], [field]: value };
      return { ...f, sizes };
    });
  }

  function addSize() {
    setForm((f) => ({ ...f, sizes: [...f.sizes, { label: "", price: "" }] }));
  }

  function removeSize(index) {
    setForm((f) => ({ ...f, sizes: f.sizes.filter((_, i) => i !== index) }));
  }

  function handleCategorySelect(e) {
    const value = e.target.value;
    if (value === "__new__") {
      setAddingCategory(true);
      setNewCategory("");
    } else {
      setAddingCategory(false);
      update("category", value);
    }
  }

  function confirmNewCategory() {
    const clean = newCategory.trim().toLowerCase().replace(/\s+/g, "-");
    if (!clean) return;
    update("category", clean);
    setAddingCategory(false);
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from("menu-images").upload(path, file);
    if (error) {
      setUploading(false);
      setUploadError(error.message);
      return;
    }

    const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
    update("img", data.publicUrl);
    setUploading(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const sizesObj = {};
    form.sizes.forEach((s) => {
      if (s.label.trim()) sizesObj[s.label.trim()] = Number(s.price) || 0;
    });
    if (Object.keys(sizesObj).length === 0) {
      alert("Add at least one size and price before saving.");
      return;
    }
    onSave({
      id: isEdit ? form.id : slugify(form.name),
      name: form.name.trim(),
      category: form.category,
      tag: form.tag.trim(),
      img: form.img.trim(),
      sizes: sizesObj,
    });
  }

  return (
    <form className="tnt-form admin-menu-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input required value={form.name} onChange={(e) => update("name", e.target.value)} />
      </label>

      <label>
        Category
        <select value={addingCategory ? "__new__" : form.category} onChange={handleCategorySelect}>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
          <option value="__new__">+ Add new category…</option>
        </select>
      </label>
      {addingCategory && (
        <div className="size-row">
          <input
            placeholder="e.g. Drinks, Desserts"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            autoFocus
          />
          <button type="button" className="cta-outline" onClick={confirmNewCategory}>Use this category</button>
        </div>
      )}

      <label>
        Short description (tag)
        <input value={form.tag} onChange={(e) => update("tag", e.target.value)} />
      </label>

      <label>
        Photo
        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
      </label>
      {uploading && <p className="muted-text">Uploading photo…</p>}
      {uploadError && <div className="form-error">{uploadError}</div>}
      {form.img && (
        <img src={form.img} alt="Preview" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, marginBottom: 12 }} />
      )}
      <label>
        Or paste an image URL instead
        <input value={form.img} onChange={(e) => update("img", e.target.value)} placeholder="https://…" />
      </label>

      <div className="size-rows">
        <span>Sizes &amp; Prices (₦)</span>
        {form.sizes.map((s, i) => (
          <div className="size-row" key={i}>
            <input placeholder="e.g. Medium" value={s.label} onChange={(e) => updateSize(i, "label", e.target.value)} />
            <input type="number" placeholder="Price" value={s.price} onChange={(e) => updateSize(i, "price", e.target.value)} />
            <button type="button" onClick={() => removeSize(i)} disabled={form.sizes.length === 1}>✕</button>
          </div>
        ))}
        <button type="button" className="cta-outline" onClick={addSize}>+ Add size</button>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="cta-btn" disabled={saving || uploading}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Item"}
        </button>
        <button type="button" className="cta-outline" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36).slice(-4);
}