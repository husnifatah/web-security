import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterInput } from "../schemas/user";
import { useState } from "react";
import { sanitize } from "../lib/sanitize";

export default function SafeForm() {
  const [serverMsg, setServerMsg] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "", website: "", bio: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterInput) => {
    // Contoh: sanitasi bio bila akan disimpan/dirender sebagai HTML
    const safeData = { ...data, bio: data.bio ? sanitize(data.bio) : "" };

    // Kirim ke API lokal yang nanti kita buat di server Bun
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(safeData),
    });

    const payload = await res.json();
    setServerMsg(res.ok ? "Registrasi OK ✅" : `Gagal ❌: ${payload?.message ?? "Unknown"}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="form-label">Nama Lengkap</label>
        <input
          className="form-control"
          placeholder="Masukkan nama lengkap"
          {...register("name")}
        />
        {errors.name && <p className="text-error">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          className="form-control"
          type="email"
          placeholder="Masukkan email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && <p className="text-error">{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          className="form-control"
          type="password"
          placeholder="Masukkan password"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && <p className="text-error">{errors.password.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Website (opsional)</label>
        <input
          className="form-control"
          type="url"
          placeholder="https://contoh.com"
          {...register("website")}
        />
        {errors.website && <p className="text-error">{errors.website.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Bio (opsional)</label>
        <textarea
          className="form-control"
          rows={4}
          placeholder="Ceritakan sedikit tentang diri Anda..."
          {...register("bio")}
        />
        {errors.bio && <p className="text-error">{errors.bio.message}</p>}
      </div>

      <button
        disabled={isSubmitting}
        className="btn"
        type="submit"
      >
        {isSubmitting ? (
          <>
            <span className="btn-spinner"></span>
            Mengirim...
          </>
        ) : (
          "Daftar"
        )}
      </button>

      {serverMsg && (
        <div className={`alert ${serverMsg.includes("OK") ? "alert-success" : "alert-error"}`}>
          {serverMsg}
        </div>
      )}
    </form>
  );
}

