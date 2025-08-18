"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function FormPage() {
  const { user } = useUser();
  const [type, setType] = useState("Pengeluaran");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [detail, setDetail] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  // Update categories based on type
  useEffect(() => {
    if (type === "Pengeluaran") {
      setCategories(["Makanan & Minuman", "Fashion", "Skincare, Body Care, Hair Care", "Bensin", "Belanja Bulanan", "LainLain"]);
    } else {
      setCategories(["Gaji", "Hadiah", "Investasi", "Lain Lain"]);
    }
    setCategory("");
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("User not signed in");

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.emailAddresses[0].emailAddress,
        type,
        category,
        name,
        price,
        detail,
      }),
    });

    if (res.ok) {
      alert("Submitted successfully!");
      setType("Pengeluaran");
      setCategory("");
      setName("");
      setPrice("");
      setDetail("");
    } else {
      alert("Failed to submit");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 max-w-md mx-auto bg-white/80 rounded shadow">
      <label className="block">
        Tipe
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="Pengeluaran">Pengeluaran</option>
          <option value="Pemasukan">Pemasukan</option>
        </select>
      </label>

      <label className="block">
        Kategori
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        Nama
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="contohnya Nasi Goreng, Kopi, dll"
          title="Nama Produk"
          className="border p-2 w-full"
          required
        />
      </label>

      <label className="block">
        Harga
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0"
          className="border p-2 w-full"
          required
        />
      </label>

      <label className="block">
        Detail
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Optional description"
          className="border p-2 w-full"
        />
      </label>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}
