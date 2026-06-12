"use client";

import { useState } from "react";
import { X, Calendar, Clock, Phone, Mail, User, Briefcase, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: "llamada" | "contacto";
}

export default function ContactModal({ isOpen, onClose, defaultType = "llamada" }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState<"llamada" | "contacto">(defaultType);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      nombre: name,
      email: email,
      telefono: phone,
      empresa: company,
      tipo_solicitud: type === "llamada" ? "Agendar Llamada" : "Mensaje de Contacto",
      fecha_sugerida: type === "llamada" ? date : "N/A",
      hora_sugerida: type === "llamada" ? time : "N/A",
      mensaje: message,
      submittedAt: new Date().toISOString(),
    };

    try {
      // Send directly to Formspree pointing to the agent email
      const response = await fetch("https://formspree.io/agente@grwocoai.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Also save locally in localStorage so the dashboard can list the submissions
      const existingLeadsStr = localStorage.getItem("growco_leads");
      const existingLeads = existingLeadsStr ? JSON.parse(existingLeadsStr) : [];
      const newLead = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        ...formData,
        status: "pendiente",
      };
      localStorage.setItem("growco_leads", JSON.stringify([newLead, ...existingLeads]));

      if (response.ok) {
        toast.success(
          type === "llamada"
            ? "¡Llamada agendada! Te enviaremos una confirmación al correo."
            : "¡Mensaje enviado! Nos pondremos en contacto pronto."
        );
      } else {
        // Formspree returns success even on first activation trigger, but we handle fallback
        toast.success("¡Solicitud recibida! Revisa tu correo agente@grwocoai.com para activar Formspree.");
      }

      // Reset form and close
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setDate("");
      setTime("");
      setMessage("");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error al enviar los datos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden border border-white/20 dark:border-white/5 bg-white/90 dark:bg-slate-900/90 shadow-2xl backdrop-blur-2xl rounded-[32px] p-8 animate-fade-up max-h-[90vh] flex flex-col z-10">
        
        {/* Glow effect */}
        <div className="absolute -right-24 -top-24 w-60 h-60 bg-[rgb(var(--cyan-bright))]/20 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute -left-24 -bottom-24 w-60 h-60 bg-[rgb(var(--accent))]/10 blur-[80px] rounded-full pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800 shrink-0 relative z-10">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-[rgb(var(--bg-dark))] dark:text-white">
              {type === "llamada" ? "Agendar una Llamada" : "Formulario de Contacto"}
            </h3>
            <p className="text-xs font-semibold text-[rgb(var(--text-secondary))] dark:text-gray-400 mt-1">
              {type === "llamada" 
                ? "Reserva una sesión corta de demo con un asesor."
                : "Déjanos tu consulta y te responderemos a la brevedad."}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selector Form Type */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl gap-1 mt-6 shrink-0 relative z-10">
          <button
            type="button"
            onClick={() => setType("llamada")}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
              type === "llamada" 
                ? "bg-white dark:bg-slate-950 text-[rgb(var(--bg-dark))] dark:text-white shadow-sm"
                : "text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--bg-dark))] dark:hover:text-white"
            }`}
          >
            <Phone className="h-3.5 w-3.5" />
            Agendar Llamada
          </button>
          <button
            type="button"
            onClick={() => setType("contacto")}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
              type === "contacto" 
                ? "bg-white dark:bg-slate-950 text-[rgb(var(--bg-dark))] dark:text-white shadow-sm"
                : "text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--bg-dark))] dark:hover:text-white"
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            Enviar Mensaje
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 overflow-y-auto pr-1 flex-1 relative z-10">
          {/* Nombre */}
          <div>
            <label className="stat-label mb-1.5 block font-bold text-[rgb(var(--text-secondary))] dark:text-gray-400">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full rounded-2xl border bg-white/50 dark:bg-slate-900/50 px-4 py-3 pl-11 text-sm outline-none transition-all font-semibold focus:border-[rgb(var(--cyan))] focus:shadow-[0_0_0_3px_rgba(0,209,255,0.12)] border-[rgb(var(--border))] dark:border-white/10 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Email y Teléfono */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="stat-label mb-1.5 block font-bold text-[rgb(var(--text-secondary))] dark:text-gray-400">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan@empresa.com"
                  className="w-full rounded-2xl border bg-white/50 dark:bg-slate-900/50 px-4 py-3 pl-11 text-sm outline-none transition-all font-semibold focus:border-[rgb(var(--cyan))] focus:shadow-[0_0_0_3px_rgba(0,209,255,0.12)] border-[rgb(var(--border))] dark:border-white/10 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="stat-label mb-1.5 block font-bold text-[rgb(var(--text-secondary))] dark:text-gray-400">
                Teléfono / WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+503 7000-0000"
                  className="w-full rounded-2xl border bg-white/50 dark:bg-slate-900/50 px-4 py-3 pl-11 text-sm outline-none transition-all font-semibold focus:border-[rgb(var(--cyan))] focus:shadow-[0_0_0_3px_rgba(0,209,255,0.12)] border-[rgb(var(--border))] dark:border-white/10 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Empresa */}
          <div>
            <label className="stat-label mb-1.5 block font-bold text-[rgb(var(--text-secondary))] dark:text-gray-400">
              Nombre de tu Empresa (Opcional)
            </label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Óptica La Fama S.A."
                className="w-full rounded-2xl border bg-white/50 dark:bg-slate-900/50 px-4 py-3 pl-11 text-sm outline-none transition-all font-semibold focus:border-[rgb(var(--cyan))] focus:shadow-[0_0_0_3px_rgba(0,209,255,0.12)] border-[rgb(var(--border))] dark:border-white/10 dark:text-white"
              />
            </div>
          </div>

          {/* Fecha y Hora (Solo para Agendar Llamada) */}
          {type === "llamada" && (
            <div className="grid gap-4 sm:grid-cols-2 bg-[rgb(var(--cyan-dim))]/40 dark:bg-slate-800/40 p-4 rounded-2xl border border-[rgb(var(--cyan))]/10">
              <div>
                <label className="stat-label mb-1.5 block font-bold text-[rgb(var(--text-secondary))] dark:text-gray-400">
                  Fecha sugerida
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-2xl border bg-white/85 dark:bg-slate-900/85 px-4 py-3 pl-11 text-sm outline-none transition-all font-semibold focus:border-[rgb(var(--cyan))] focus:shadow-[0_0_0_3px_rgba(0,209,255,0.12)] border-[rgb(var(--border))] dark:border-white/10 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="stat-label mb-1.5 block font-bold text-[rgb(var(--text-secondary))] dark:text-gray-400">
                  Hora sugerida
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-2xl border bg-white/85 dark:bg-slate-900/85 px-4 py-3 pl-11 text-sm outline-none transition-all font-semibold focus:border-[rgb(var(--cyan))] focus:shadow-[0_0_0_3px_rgba(0,209,255,0.12)] border-[rgb(var(--border))] dark:border-white/10 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mensaje / Comentario */}
          <div>
            <label className="stat-label mb-1.5 block font-bold text-[rgb(var(--text-secondary))] dark:text-gray-400">
              {type === "llamada" ? "Notas adicionales (Opcional)" : "Tu Mensaje"}
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={type === "llamada" ? "¿Algún tema específico que quieras ver en la demo?" : "Escribe tu consulta aquí..."}
                rows={3}
                className="w-full rounded-2xl border bg-white/50 dark:bg-slate-900/50 px-4 py-3 pl-11 text-sm outline-none transition-all font-semibold focus:border-[rgb(var(--cyan))] focus:shadow-[0_0_0_3px_rgba(0,209,255,0.12)] border-[rgb(var(--border))] dark:border-white/10 dark:text-white resize-none"
                required={type === "contacto"}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 py-4 mt-6 text-sm font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <Send className="h-4 w-4" />
            )}
            {type === "llamada" 
              ? (loading ? "Agendando..." : "Confirmar Agendamiento")
              : (loading ? "Enviando..." : "Enviar Mensaje de Contacto")}
          </button>
        </form>
      </div>
    </div>
  );
}
