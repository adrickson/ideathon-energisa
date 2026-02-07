const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function reportarProblema(payload) {
  const response = await fetch(`${API_BASE_URL}/reportes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Erro ao enviar reporte");
  }

  return response.json();
}

export async function parearDispositivo(payload) {
  const response = await fetch(`${API_BASE_URL}/dispositivo/parear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Erro ao parear dispositivo");
  }

  return response.json();
}

export async function buscarOcorrencias() {
  const response = await fetch(`${API_BASE_URL}/reportes`);

  if (!response.ok) {
    throw new Error("Erro ao buscar ocorrências");
  }

  return response.json();
}

export async function buscarOcorrenciaPorId(id) {
  const response = await fetch(`${API_BASE_URL}/reportes/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar ocorrência");
  }

  return response.json();
}

export async function atualizarStatusOcorrencia(id, status) {
  const response = await fetch(`${API_BASE_URL}/reportes/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar status");
  }

  return response.json();
}

export async function desconectarDispositivo() {
  const response = await fetch(`${API_BASE_URL}/dispositivo/desconectar`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Erro ao desconectar dispositivo");
  }

  return response.json();
}

export async function loginTecnico(email, senha) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Erro ao fazer login");
  }

  return response.json();
}

export async function logoutTecnico() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Erro ao fazer logout");
  }

  return response.json();
}

export function createLoginPayload(params) {
  return {
    email: params.email,
    senha: params.senha,
  };
}

export function createReportePayload(params) {
  return {
    id: params.id,
    tipo: params.tipo,
    latitude: params.latitude,
    longitude: params.longitude,
    endereco: params.endereco,
    foto: params.foto,
    observacoes: params.observacoes || null,
    timestamp: params.timestamp || new Date().toISOString(),
    status: params.status || "pendente",
    dispositivoId: params.dispositivoId || null,
  };
}

export function createPareamentoPayload(params) {
  return {
    codigo: params.codigo.toUpperCase(),
    tipoDispositivo: params.tipoDispositivo,
    usuarioId: params.usuarioId,
  };
}
