import { getPreferenceValues } from "@raycast/api";

export interface Preferences {
  token?: string;
  nodes: string;
}
const getNodes = () => {
  const { nodes } = getPreferenceValues<Preferences>();
  return nodes.split(",");
};
const getToken = () => {
  const { token } = getPreferenceValues<Preferences>();
  return token;
};
const hasToken = () => {
  const token = getToken();
  return !!token;
};

export { getNodes, hasToken, getToken };
