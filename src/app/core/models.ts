export type DeviceType =
  | 'switch'
  | 'router'
  | 'server'
  | 'firewall'
  | 'iot-sensor'
  | 'pdu'
  | 'ups';

export type AlertSeverity = 'info' | 'warn' | 'error' | 'success';

export interface DeviceTelemetry {
  cpu: number;
  ram: number;
  tempC: number;
  throughputMbps: number;
  uptimeDays: number;
}

export interface DeviceData {
  isDevice: true;
  type: DeviceType;
  mac: string;
  ip?: string;
  online: boolean;
  state?: 'online' | 'warn' | 'offline';
  lastSeen: string;
  telemetry: DeviceTelemetry;
  firmware: string;
  rackPosition?: string;
  sensorType?: 'temperature' | 'humidity' | 'vibration' | 'door';
  unit?: string;
  reading?: number;
}

export interface PortData {
  isDevice: false;
  portType?: string;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  device: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface EventEntry {
  ts: Date;
  label: string;
  icon: string;
  severity: AlertSeverity;
}

export const DEVICE_TYPE_ICON: Record<DeviceType, string> = {
  switch: 'pi pi-share-alt',
  router: 'pi pi-globe',
  server: 'pi pi-server',
  firewall: 'pi pi-shield',
  'iot-sensor': 'pi pi-wifi',
  pdu: 'pi pi-bolt',
  ups: 'pi pi-bolt',
};
