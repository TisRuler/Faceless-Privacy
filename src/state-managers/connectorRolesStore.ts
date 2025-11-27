import { create } from "zustand";
import { Connector } from "wagmi";

export const ConnectorRoles = {
  PUBLIC: "Public Address Usage",
  SELF_SIGNING: "Self-Signing Tx's",
} as const;

export type ConnectorRole = (typeof ConnectorRoles)[keyof typeof ConnectorRoles];

const roleKeyMap = {
  [ConnectorRoles.PUBLIC]: "publicConnectorId",
  [ConnectorRoles.SELF_SIGNING]: "selfSigningConnectorId",
} as const;

interface ConnectorRolestate {
  publicConnectorId?: string;
  selfSigningConnectorId?: string;

  assignRoleToConnector: (connector: Connector, role: ConnectorRole) => void;
  removeRoleFromConnector: (connectorId: string) => void;
  clearRole: (role: ConnectorRole) => void;
  clearAllRoles: () => void;
  getConnectorIdForRole: (role: ConnectorRole) => string | undefined;
  getRoleForConnectorId: (connectorId: string) => ConnectorRole[];
}

export const useConnectorRolesStore = create<ConnectorRolestate>((set, get) => ({
  publicConnectorId: undefined,
  selfSigningConnectorId: undefined,

  assignRoleToConnector: (connector, role) => {
    const id = connector.id;

    // Directly replace the connector for this role (does NOT remove it from other roles)
    set({ [roleKeyMap[role]]: id } as Partial<ConnectorRolestate>);
  },

  removeRoleFromConnector: (connectorId) => {
    const state = get();
    set({
      publicConnectorId: state.publicConnectorId === connectorId ? undefined : state.publicConnectorId,
      selfSigningConnectorId: state.selfSigningConnectorId === connectorId ? undefined : state.selfSigningConnectorId,
    });
  },

  clearRole: (role) => {
    set({ [roleKeyMap[role]]: undefined } as Partial<ConnectorRolestate>);
  },

  clearAllRoles: () =>
    set({
      publicConnectorId: undefined,
      selfSigningConnectorId: undefined,
    }),

  getConnectorIdForRole: (role) => get()[roleKeyMap[role]],

  getRoleForConnectorId: (connectorId) => {
    const state = get();
    const roles: ConnectorRole[] = [];

    if (state.publicConnectorId === connectorId) roles.push(ConnectorRoles.PUBLIC);
    if (state.selfSigningConnectorId === connectorId) roles.push(ConnectorRoles.SELF_SIGNING);

    return roles;
  },
}));
