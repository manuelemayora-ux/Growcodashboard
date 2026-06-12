"use client";

import { useState, useEffect } from "react";
import { 
  Mail, Phone, Calendar, Clock, Trash2, CheckCircle2, 
  AlertCircle, MessageSquare, Briefcase, User, RefreshCw 
} from "lucide-react";
import { toast } from "sonner";

interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string;
  tipo_solicitud: string;
  fecha_sugerida: string;
  hora_sugerida: string;
  mensaje: string;
  submittedAt: string;
  status: "pendiente" | "atendido";
}

const SAMPLE_LEADS: Lead[] = [
  {
    id: "sample-1",
    nombre: "Ing. Carlos Mendoza",
    email: "carlos.mendoza@opticaelsalvador.com",
    telefono: "+503 7120-4566",
    empresa: "Óptica El Salvador",
    tipo_solicitud: "Agendar Llamada",
    fecha_sugerida: "2026-06-16",
    hora_sugerida: "14:30",
    mensaje: "Deseo ver la integración del módulo de recetas ópticas y control de laboratorios.",
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    status: "pendiente"
  },
  {
    id: "sample-2",
    nombre: "Sofia Rodríguez",
    email: "srodriguez@glamboutique.sv",
    telefono: "+503 7890-1122",
    empresa: "Glam Boutique",
    tipo_solicitud: "Mensaje de Contacto",
    fecha_sugerida: "N/A",
    hora_sugerida: "N/A",
    mensaje: "Quisiera cotizar el plan multi-sucursal para 3 bodegas de calzado.",
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    status: "atendido"
  },
  {
    id: "sample-3",
    nombre: "Alejandro Tobar",
    email: "atobar@distribuidora-alfa.com",
    telefono: "+503 2250-9900",
    empresa: "Distribuidora Alfa",
    tipo_solicitud: "Agendar Llamada",
    fecha_sugerida: "2026-06-18",
    hora_sugerida: "10:00",
    mensaje: "Consulta sobre facturación electrónica de El Salvador y compatibilidad con impresoras térmicas.",
    submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    status: "pendiente"
  }
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  // Load leads from localStorage
  useEffect(() => {
    const loadedLeadsStr = localStorage.getItem("growco_leads");
    if (loadedLeadsStr) {
      setLeads(JSON.parse(loadedLeadsStr));
    } else {
      // Seed with sample data if empty
      localStorage.setItem("growco_leads", JSON.stringify(SAMPLE_LEADS));
      setLeads(SAMPLE_LEADS);
    }
  }, []);

  const toggleStatus = (id: string) => {
    const updated = leads.map(lead => {
      if (lead.id === id) {
        const newStatus: "pendiente" | "atendido" = lead.status === "pendiente" ? "atendido" : "pendiente";
        toast.success(`Lead marcado como ${newStatus === "atendido" ? "Atendido" : "Pendiente"}`);
        return { ...lead, status: newStatus };
      }
      return lead;
    });
    setLeads(updated);
    localStorage.setItem("growco_leads", JSON.stringify(updated));
  };

  const deleteLead = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este registro de lead?")) {
      const filtered = leads.filter(lead => lead.id !== id);
      setLeads(filtered);
      localStorage.setItem("growco_leads", JSON.stringify(filtered));
      toast.success("Lead eliminado correctamente");
    }
  };

  const resetSamples = () => {
    if (confirm("¿Deseas restaurar los leads de demostración?")) {
      localStorage.setItem("growco_leads", JSON.stringify(SAMPLE_LEADS));
      setLeads(SAMPLE_LEADS);
      toast.success("Leads de demostración restaurados");
    }
  };

  // Helper to format date strings
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("es-SV", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--bg-dark))]">
            Leads y Contacto
          </h1>
          <p className="text-sm font-medium" style={{ color: "rgb(var(--text-secondary))" }}>
            Mensajes del formulario y llamadas agendadas para agente@grwocoai.com
          </p>
        </div>
        <button
          onClick={resetSamples}
          className="btn-dark py-2.5 px-5 text-xs font-bold hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 self-start cursor-pointer shadow-md"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Restaurar Demo Leads
        </button>
      </div>

      {/* Grid of Leads */}
      {leads.length === 0 ? (
        <div className="bento-card py-16 text-center">
          <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[rgb(var(--bg-dark))] mb-1">No hay leads registrados</h3>
          <p className="text-sm text-[rgb(var(--text-secondary))]" style={{ maxWidth: "300px", margin: "0 auto" }}>
            Envía una solicitud desde el formulario de contacto para verla reflejada aquí.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {leads.map((lead) => (
            <div 
              key={lead.id} 
              className={`bento-card border transition-all relative overflow-hidden flex flex-col justify-between min-h-[280px] p-6 hover:shadow-lg ${
                lead.status === "atendido" 
                  ? "border-[rgb(var(--border))] opacity-75" 
                  : "border-[rgb(var(--cyan))]/20 shadow-sm"
              }`}
            >
              {/* Top Row: Type Badge and Action Buttons */}
              <div className="flex items-center justify-between mb-4">
                <span className={`badge-pill font-black text-[10px] px-3.5 py-1 ${
                  lead.tipo_solicitud === "Agendar Llamada"
                    ? "bg-[rgb(var(--cyan-dim))] text-[rgb(var(--blue-deep))]"
                    : "bg-purple-100 text-purple-700"
                }`}>
                  {lead.tipo_solicitud}
                </span>

                <div className="flex items-center gap-2">
                  {/* Status Toggle Button */}
                  <button 
                    onClick={() => toggleStatus(lead.id)}
                    title={lead.status === "pendiente" ? "Marcar como Atendido" : "Marcar como Pendiente"}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all cursor-pointer ${
                      lead.status === "atendido"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    }`}
                  >
                    {lead.status === "atendido" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={() => deleteLead(lead.id)}
                    title="Eliminar Lead"
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Main Info */}
              <div className="flex-1 space-y-3">
                {/* Contact Name & Company */}
                <div>
                  <h3 className="text-lg font-black text-[rgb(var(--bg-dark))] flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    {lead.nombre}
                  </h3>
                  {lead.empresa && (
                    <p className="text-xs font-bold text-[rgb(var(--text-secondary))] flex items-center gap-2 mt-0.5">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                      {lead.empresa}
                    </p>
                  )}
                </div>

                {/* Email and Phone */}
                <div className="grid gap-2 sm:grid-cols-2 text-xs font-semibold text-[rgb(var(--text-secondary))]">
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:text-[rgb(var(--cyan-bright))] transition-colors">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {lead.email}
                  </a>
                  <a href={`tel:${lead.telefono}`} className="flex items-center gap-2 hover:text-[rgb(var(--cyan-bright))] transition-colors">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    {lead.telefono}
                  </a>
                </div>

                {/* Meeting Suggested Date/Time (Only for Agendar Llamada) */}
                {lead.tipo_solicitud === "Agendar Llamada" && (
                  <div className="bg-[rgb(var(--cyan-dim))]/30 border border-[rgb(var(--cyan))]/10 p-3 rounded-xl flex items-center gap-4 text-xs font-bold text-[rgb(var(--blue-deep))]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[rgb(var(--cyan-bright))]" />
                      {lead.fecha_sugerida}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[rgb(var(--cyan-bright))]" />
                      {lead.hora_sugerida}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5 mt-2">
                  <p className="text-xs font-semibold text-[rgb(var(--text-secondary))] dark:text-gray-300 leading-relaxed italic">
                    &ldquo;{lead.mensaje}&rdquo;
                  </p>
                </div>
              </div>

              {/* Footer Timestamp */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-[10px] font-bold text-[rgb(var(--text-dim))] flex justify-between items-center">
                <span>ID: {lead.id}</span>
                <span>Recibido: {formatDate(lead.submittedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
