export interface YdmLogisticsSettings {
  id?: number;
  inside_ringroad_charge: string; // DecimalField comes as string from DRF
  outside_ringroad_charge: string;
}

export type YdmLogisticsSettingsPayload = Omit<YdmLogisticsSettings, "id">;
