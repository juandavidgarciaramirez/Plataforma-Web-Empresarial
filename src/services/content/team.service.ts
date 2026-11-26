import { api } from "@/lib/api/axios";

export type TeamMemberStatus = "ACTIVE" | "INACTIVE";
export type TeamMemberOrgLevel = 1 | 2 | 3;
export type TeamMemberConnectorCurve = "left" | "right";

export interface ApiTeamMember {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  photoUrl: string | null;
  photoAlt: string | null;
  photoFileId?: string | null;
  order: number;
  status: TeamMemberStatus;
  profession: string | null;
  area: string | null;
  serviceCode: string | null;
  specialties: string[];
  certifications: string[] | null;
  certificationsLabel: string | null;
  isTransversal: boolean;
  orgLevel: TeamMemberOrgLevel | null;
  parentId: string | null;
  connectorCurve: TeamMemberConnectorCurve | null;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberInput {
  name: string;
  position: string;
  bio?: string;
  photoUrl?: string;
  photoFileId?: string | null;
  photoAlt?: string | null;
  order?: number;
  status?: TeamMemberStatus;
  profession?: string;
  area?: string;
  serviceCode?: string;
  specialties?: string[];
  certifications?: string[];
  certificationsLabel?: string;
  isTransversal?: boolean;
  orgLevel?: TeamMemberOrgLevel;
  parentId?: string;
  connectorCurve?: TeamMemberConnectorCurve;
}

/** Consume `/api/v1/team/**` (backend NestJS). */
export const teamService = {
  getAll: () => api.get<{ data: ApiTeamMember[] }>("/team").then((res) => res.data.data),

  create: (data: TeamMemberInput) => api.post<{ data: ApiTeamMember }>("/team", data).then((res) => res.data.data),

  update: (id: string, data: Partial<TeamMemberInput>) =>
    api.patch<{ data: ApiTeamMember }>(`/team/${id}`, data).then((res) => res.data.data),

  remove: (id: string) => api.delete(`/team/${id}`),
};
