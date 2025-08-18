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

  const allowedEmails = process.env.NEXT_PUBLI_ALLOWED_EMAILS?.split(",") || [];
  const userEmail = user?.emailAddresses[0].emailAddress;

  // Disable button if user is not allowed
  const isAllowed = userEmail ? allowedEmails.includes(userEmail) : false;

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
      <label className="block text-gray-700">
        Tipe
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="Pengeluaran" className="text-gray-700">Pengeluaran</option>
          <option value="Pemasukan" className="text-gray-700">Pemasukan</option>
        </select>
      </label>

      <label className="block text-gray-700">
        Kategori
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full text-gray-700"
        >
          <option value="" className="text-gray-700">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c} className="text-gray-700">
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-gray-700">
        Nama
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="contohnya Nasi Goreng, Kopi, dll"
          title="Nama Produk"
          className="border p-2 w-full text-gray-700"
          required
        />
      </label>

      <label className="block text-gray-700">
        Harga
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0"
          className="border p-2 w-full text-gray-700"
          required
        />
      </label>

      <label className="block text-gray-700">
        Detail
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Optional description"
          className="border p-2 w-full text-gray-700"
        />
      </label>

      <button
        type="submit"
        className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600"
        // className={`px-4 py-2 rounded text-white ${
        //     isAllowed ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
        // }`}
      >
        Submit
      </button>
      {!isAllowed && <p className="text-red-500 text-sm mt-1">You are not authorized to submit data.</p>}
    </form>
  );
}
