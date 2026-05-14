import { Injectable, signal } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Alert, DeviceData, EventEntry } from './models';

function device(
  partial: Omit<DeviceData, 'isDevice'> & Partial<Pick<DeviceData, 'state'>>,
): DeviceData {
  return {
    isDevice: true,
    state: partial.online ? partial.state ?? 'online' : 'offline',
    ...partial,
  };
}

function sensor(
  mac: string,
  sensorType: DeviceData['sensorType'],
  reading: number,
  unit: string,
  online = true,
): DeviceData {
  return {
    isDevice: true,
    type: 'iot-sensor',
    mac,
    online,
    state: online ? 'online' : 'offline',
    lastSeen: online ? 'Gerade eben' : 'Vor 2 Stunden',
    firmware: 'sens-v1.4.0',
    sensorType,
    reading,
    unit,
    telemetry: {
      cpu: 4,
      ram: 12,
      tempC: 22,
      throughputMbps: 0.05,
      uptimeDays: 184,
    },
  };
}

@Injectable({ providedIn: 'root' })
export class DataService {
  readonly nodes = signal<TreeNode[]>(this.buildTree());
  readonly selectedNode = signal<TreeNode | null>(null);

  constructor() {
    const fra = this.nodes()[0].children![0];
    const rackA1 = fra.children![0];
    const coreSwitch = rackA1.children![0];
    this.selectedNode.set(coreSwitch);
  }

  setNodes(nodes: TreeNode[]) {
    this.nodes.set(nodes);
  }

  select(node: TreeNode | null) {
    this.selectedNode.set(node);
  }

  getAlerts(): Alert[] {
    const now = Date.now();
    const mins = (m: number) => new Date(now - m * 60_000);
    return [
      { id: 'A-1041', severity: 'error', device: 'Core-Switch-02', message: 'Verbindung zu Uplink verloren', timestamp: mins(4), acknowledged: false },
      { id: 'A-1040', severity: 'warn', device: 'Server-Compute-02', message: 'CPU-Auslastung 92% seit 5 Min', timestamp: mins(8), acknowledged: false },
      { id: 'A-1039', severity: 'warn', device: 'Temp-Sensor-A1', message: 'Temperatur über Schwellwert (28.4°C)', timestamp: mins(14), acknowledged: true },
      { id: 'A-1038', severity: 'info', device: 'Edge-Router-01', message: 'BGP-Session zu AS64500 wiederhergestellt', timestamp: mins(22), acknowledged: true },
      { id: 'A-1037', severity: 'error', device: 'PDU-Rack-B1', message: 'Stromabfall auf Phase 2', timestamp: mins(31), acknowledged: false },
      { id: 'A-1036', severity: 'success', device: 'Firewall-Cluster-A', message: 'Failover-Test erfolgreich abgeschlossen', timestamp: mins(48), acknowledged: true },
      { id: 'A-1035', severity: 'warn', device: 'Vibration-Sensor-B2', message: 'Vibration über Normbereich', timestamp: mins(65), acknowledged: false },
      { id: 'A-1034', severity: 'info', device: 'Storage-NAS-01', message: 'Snapshot abgeschlossen (1.2 TB)', timestamp: mins(83), acknowledged: true },
      { id: 'A-1033', severity: 'error', device: 'Server-Compute-04', message: 'Disk SMART-Warnung Sektor 3201', timestamp: mins(110), acknowledged: false },
      { id: 'A-1032', severity: 'warn', device: 'IoT-Gateway-01', message: 'MQTT-Queue läuft voll', timestamp: mins(135), acknowledged: false },
      { id: 'A-1031', severity: 'info', device: 'USV-Hauptraum', message: 'Wartungszyklus abgeschlossen', timestamp: mins(180), acknowledged: true },
      { id: 'A-1030', severity: 'success', device: 'Core-Switch-01', message: 'Firmware-Update auf v2.2.0 erfolgreich', timestamp: mins(240), acknowledged: true },
      { id: 'A-1029', severity: 'warn', device: 'Edge-Router-NY', message: 'Erhöhte Paketverluste auf WAN1', timestamp: mins(310), acknowledged: false },
      { id: 'A-1028', severity: 'info', device: 'Distribution-Switch-B1', message: 'Konfiguration synchronisiert', timestamp: mins(420), acknowledged: true },
      { id: 'A-1027', severity: 'error', device: 'Humidity-Sensor-A1', message: 'Sensor antwortet nicht', timestamp: mins(540), acknowledged: false },
      { id: 'A-1026', severity: 'warn', device: 'Server-Compute-03', message: 'RAM-Auslastung 88%', timestamp: mins(620), acknowledged: true },
      { id: 'A-1025', severity: 'info', device: 'PDU-Rack-A1', message: 'Energie-Bericht generiert', timestamp: mins(720), acknowledged: true },
      { id: 'A-1024', severity: 'success', device: 'Storage-NAS-01', message: 'RAID-Rebuild abgeschlossen', timestamp: mins(840), acknowledged: true },
      { id: 'A-1023', severity: 'warn', device: 'Door-Sensor-B2', message: 'Tür länger als 5 Min geöffnet', timestamp: mins(960), acknowledged: true },
      { id: 'A-1022', severity: 'error', device: 'Router-Gateway', message: 'Gateway nicht erreichbar', timestamp: mins(1320), acknowledged: false },
    ];
  }

  getEvents(): EventEntry[] {
    const now = Date.now();
    const mins = (m: number) => new Date(now - m * 60_000);
    return [
      { ts: mins(2), label: 'Core-Switch-02 — Uplink verloren', icon: 'pi pi-bolt', severity: 'error' },
      { ts: mins(6), label: 'Server-Compute-02 — CPU 92%', icon: 'pi pi-microchip', severity: 'warn' },
      { ts: mins(11), label: 'Temp-Sensor-A1 — 28.4°C', icon: 'pi pi-sun', severity: 'warn' },
      { ts: mins(18), label: 'Edge-Router-01 — BGP wiederhergestellt', icon: 'pi pi-check', severity: 'success' },
      { ts: mins(27), label: 'PDU-Rack-B1 — Phase 2 ausgefallen', icon: 'pi pi-bolt', severity: 'error' },
      { ts: mins(42), label: 'Firewall-Cluster-A — Failover OK', icon: 'pi pi-shield', severity: 'success' },
      { ts: mins(58), label: 'Vibration-Sensor-B2 — Anomalie', icon: 'pi pi-volume-up', severity: 'warn' },
      { ts: mins(75), label: 'Storage-NAS-01 — Snapshot fertig', icon: 'pi pi-database', severity: 'info' },
      { ts: mins(98), label: 'Server-Compute-04 — Disk-Warnung', icon: 'pi pi-exclamation-triangle', severity: 'error' },
      { ts: mins(120), label: 'IoT-Gateway-01 — MQTT-Queue', icon: 'pi pi-cloud', severity: 'warn' },
      { ts: mins(160), label: 'USV-Hauptraum — Wartung OK', icon: 'pi pi-check-circle', severity: 'info' },
      { ts: mins(220), label: 'Core-Switch-01 — Firmware v2.2.0', icon: 'pi pi-sync', severity: 'success' },
      { ts: mins(280), label: 'Edge-Router-NY — Paketverlust', icon: 'pi pi-wifi', severity: 'warn' },
      { ts: mins(380), label: 'Distribution-Switch-B1 — Config-Sync', icon: 'pi pi-cog', severity: 'info' },
      { ts: mins(500), label: 'Humidity-Sensor-A1 — keine Antwort', icon: 'pi pi-times-circle', severity: 'error' },
    ];
  }

  getTrafficSeries() {
    const labels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
    const rx = [120, 95, 80, 70, 65, 80, 140, 220, 310, 380, 420, 440, 430, 410, 395, 410, 460, 510, 540, 490, 420, 340, 260, 180];
    const tx = [80, 65, 55, 50, 45, 60, 110, 180, 250, 290, 330, 360, 350, 330, 305, 320, 360, 400, 430, 380, 320, 260, 200, 140];
    return { labels, rx, tx };
  }

  getDeviceLoadSeries() {
    return {
      labels: ['Core-Sw-01', 'Core-Sw-02', 'Edge-R-01', 'FW-Cluster', 'Srv-Cmp-01', 'Srv-Cmp-02', 'Srv-Cmp-03', 'Srv-Cmp-04', 'NAS-01', 'IoT-Gw-01'],
      cpu: [34, 0, 41, 52, 68, 92, 71, 58, 22, 47],
      ram: [42, 0, 38, 61, 74, 81, 88, 63, 49, 55],
    };
  }

  getSensorTrends() {
    const labels = Array.from({ length: 12 }, (_, i) => `${i * 2}:00`);
    return {
      labels,
      temp: [21.4, 21.2, 21.0, 20.9, 21.1, 22.3, 23.8, 25.1, 26.2, 27.4, 28.1, 27.6],
      humidity: [48, 49, 50, 51, 51, 49, 47, 45, 43, 42, 41, 42],
    };
  }

  getStatusDistribution() {
    return { online: 47, warn: 6, offline: 3 };
  }

  getKpis() {
    return {
      totalDevices: 56,
      onlinePct: 92,
      activeAlerts: this.getAlerts().filter((a) => !a.acknowledged).length,
      throughputGbps: 4.7,
      totalDevicesTrend: 4,
      onlinePctTrend: -2,
      activeAlertsTrend: 3,
      throughputTrend: 8,
    };
  }

  private buildTree(): TreeNode[] {
    return [
      {
        key: 'eu',
        label: 'Europa',
        expanded: true,
        icon: 'pi pi-map',
        children: [
          {
            key: 'eu-fra',
            label: 'Rechenzentrum Frankfurt',
            expanded: true,
            icon: 'pi pi-building',
            children: [
              {
                key: 'eu-fra-a1',
                label: 'Rack A1',
                expanded: true,
                icon: 'pi pi-th-large',
                children: [
                  {
                    key: 'eu-fra-a1-sw01',
                    label: 'Core-Switch-01',
                    data: device({
                      type: 'switch',
                      mac: '00:1B:44:11:3A:B7',
                      ip: '10.10.0.1',
                      online: true,
                      lastSeen: 'Gerade eben',
                      firmware: 'switch-os v2.2.0',
                      rackPosition: 'A1-U12',
                      telemetry: { cpu: 34, ram: 42, tempC: 38.2, throughputMbps: 1840, uptimeDays: 184 },
                    }),
                    children: [
                      { key: 'eu-fra-a1-sw01-p1', label: 'Port 1 (Uplink WAN)', data: { isDevice: false, portType: 'uplink' } as any },
                      { key: 'eu-fra-a1-sw01-p2', label: 'Port 2 (Server-Rack)', data: { isDevice: false, portType: 'access' } as any },
                      { key: 'eu-fra-a1-sw01-p3', label: 'Port 3 (DMZ)', data: { isDevice: false, portType: 'access' } as any },
                    ],
                  },
                  {
                    key: 'eu-fra-a1-r01',
                    label: 'Edge-Router-01',
                    data: device({
                      type: 'router',
                      mac: '00:1B:44:22:81:01',
                      ip: '10.10.0.254',
                      online: true,
                      lastSeen: 'Gerade eben',
                      firmware: 'route-os v4.1.6',
                      rackPosition: 'A1-U14',
                      telemetry: { cpu: 41, ram: 38, tempC: 41.0, throughputMbps: 2100, uptimeDays: 312 },
                    }),
                  },
                  {
                    key: 'eu-fra-a1-fw',
                    label: 'Firewall-Cluster-A',
                    data: device({
                      type: 'firewall',
                      mac: '00:1B:44:33:11:AA',
                      ip: '10.10.0.2',
                      online: true,
                      lastSeen: 'Gerade eben',
                      firmware: 'fw-os v8.0.2',
                      rackPosition: 'A1-U16',
                      telemetry: { cpu: 52, ram: 61, tempC: 44.5, throughputMbps: 980, uptimeDays: 90 },
                    }),
                  },
                ],
              },
              {
                key: 'eu-fra-a2',
                label: 'Rack A2',
                expanded: true,
                icon: 'pi pi-th-large',
                children: [
                  {
                    key: 'eu-fra-a2-srv1',
                    label: 'Server-Compute-01',
                    data: device({
                      type: 'server',
                      mac: '00:1B:44:55:01:01',
                      ip: '10.10.10.11',
                      online: true,
                      lastSeen: 'Gerade eben',
                      firmware: 'bmc v3.9.0',
                      rackPosition: 'A2-U02',
                      telemetry: { cpu: 68, ram: 74, tempC: 52.1, throughputMbps: 320, uptimeDays: 76 },
                    }),
                  },
                  {
                    key: 'eu-fra-a2-srv2',
                    label: 'Server-Compute-02',
                    data: device({
                      type: 'server',
                      mac: '00:1B:44:55:01:02',
                      ip: '10.10.10.12',
                      online: true,
                      state: 'warn',
                      lastSeen: 'Gerade eben',
                      firmware: 'bmc v3.9.0',
                      rackPosition: 'A2-U04',
                      telemetry: { cpu: 92, ram: 81, tempC: 64.3, throughputMbps: 540, uptimeDays: 76 },
                    }),
                  },
                  {
                    key: 'eu-fra-a2-srv3',
                    label: 'Server-Compute-03',
                    data: device({
                      type: 'server',
                      mac: '00:1B:44:55:01:03',
                      ip: '10.10.10.13',
                      online: true,
                      lastSeen: 'Gerade eben',
                      firmware: 'bmc v3.9.0',
                      rackPosition: 'A2-U06',
                      telemetry: { cpu: 71, ram: 88, tempC: 56.0, throughputMbps: 410, uptimeDays: 60 },
                    }),
                  },
                  {
                    key: 'eu-fra-a2-nas1',
                    label: 'Storage-NAS-01',
                    data: device({
                      type: 'server',
                      mac: '00:1B:44:55:99:01',
                      ip: '10.10.20.10',
                      online: true,
                      lastSeen: 'Gerade eben',
                      firmware: 'storage-os v6.2.4',
                      rackPosition: 'A2-U10',
                      telemetry: { cpu: 22, ram: 49, tempC: 39.8, throughputMbps: 720, uptimeDays: 450 },
                    }),
                  },
                ],
              },
              {
                key: 'eu-fra-klima',
                label: 'Klima & Strom',
                expanded: false,
                icon: 'pi pi-sun',
                children: [
                  {
                    key: 'eu-fra-pdu-a1',
                    label: 'PDU-Rack-A1',
                    data: device({
                      type: 'pdu',
                      mac: '00:1B:44:88:01:01',
                      online: true,
                      lastSeen: 'Gerade eben',
                      firmware: 'pdu-fw v1.6.0',
                      telemetry: { cpu: 6, ram: 18, tempC: 31.2, throughputMbps: 0.1, uptimeDays: 720 },
                    }),
                  },
                  {
                    key: 'eu-fra-ups',
                    label: 'USV-Hauptraum',
                    data: device({
                      type: 'ups',
                      mac: '00:1B:44:88:01:02',
                      online: true,
                      lastSeen: 'Gerade eben',
                      firmware: 'ups-fw v2.3.1',
                      telemetry: { cpu: 4, ram: 12, tempC: 28.4, throughputMbps: 0.05, uptimeDays: 820 },
                    }),
                  },
                  { key: 'eu-fra-temp-a1', label: 'Temp-Sensor-A1', data: sensor('00:1B:44:AA:01:01', 'temperature', 28.4, '°C') },
                  { key: 'eu-fra-hum-a1', label: 'Humidity-Sensor-A1', data: sensor('00:1B:44:AA:01:02', 'humidity', 47, '%', false) },
                ],
              },
            ],
          },
          {
            key: 'eu-ber',
            label: 'Rechenzentrum Berlin',
            expanded: false,
            icon: 'pi pi-building',
            children: [
              {
                key: 'eu-ber-b1',
                label: 'Rack B1',
                icon: 'pi pi-th-large',
                children: [
                  {
                    key: 'eu-ber-b1-sw02',
                    label: 'Core-Switch-02',
                    data: device({
                      type: 'switch',
                      mac: '00:1B:44:11:3A:C9',
                      ip: '10.20.0.1',
                      online: false,
                      lastSeen: 'Vor 4 Min',
                      firmware: 'switch-os v2.1.4',
                      rackPosition: 'B1-U12',
                      telemetry: { cpu: 0, ram: 0, tempC: 0, throughputMbps: 0, uptimeDays: 0 },
                    }),
                  },
                  {
                    key: 'eu-ber-b1-dsw',
                    label: 'Distribution-Switch-B1',
                    data: device({
                      type: 'switch',
                      mac: '00:1B:44:11:3B:01',
                      ip: '10.20.0.2',
                      online: true,
                      lastSeen: 'Gerade eben',
                      firmware: 'switch-os v2.2.0',
                      rackPosition: 'B1-U14',
                      telemetry: { cpu: 28, ram: 33, tempC: 36.0, throughputMbps: 1200, uptimeDays: 210 },
                    }),
                  },
                  {
                    key: 'eu-ber-b1-pdu',
                    label: 'PDU-Rack-B1',
                    data: device({
                      type: 'pdu',
                      mac: '00:1B:44:88:02:01',
                      online: true,
                      state: 'warn',
                      lastSeen: 'Gerade eben',
                      firmware: 'pdu-fw v1.6.0',
                      telemetry: { cpu: 6, ram: 18, tempC: 33.5, throughputMbps: 0.1, uptimeDays: 540 },
                    }),
                  },
                ],
              },
              {
                key: 'eu-ber-b2',
                label: 'Rack B2',
                icon: 'pi pi-th-large',
                children: [
                  {
                    key: 'eu-ber-b2-gw',
                    label: 'IoT-Gateway-01',
                    data: device({
                      type: 'server',
                      mac: '00:1B:44:55:02:01',
                      ip: '10.20.30.10',
                      online: true,
                      state: 'warn',
                      lastSeen: 'Gerade eben',
                      firmware: 'gw-os v1.4.0',
                      rackPosition: 'B2-U02',
                      telemetry: { cpu: 47, ram: 55, tempC: 42.0, throughputMbps: 88, uptimeDays: 122 },
                    }),
                  },
                  {
                    key: 'eu-ber-b2-srv4',
                    label: 'Server-Compute-04',
                    data: device({
                      type: 'server',
                      mac: '00:1B:44:55:02:04',
                      ip: '10.20.10.14',
                      online: true,
                      state: 'warn',
                      lastSeen: 'Gerade eben',
                      firmware: 'bmc v3.9.0',
                      rackPosition: 'B2-U04',
                      telemetry: { cpu: 58, ram: 63, tempC: 51.0, throughputMbps: 280, uptimeDays: 65 },
                    }),
                  },
                  { key: 'eu-ber-b2-vib', label: 'Vibration-Sensor-B2', data: sensor('00:1B:44:AA:02:01', 'vibration', 1.4, 'g') },
                  { key: 'eu-ber-b2-door', label: 'Door-Sensor-B2', data: sensor('00:1B:44:AA:02:02', 'door', 1, '') },
                  { key: 'eu-ber-b2-temp1', label: 'Temp-Sensor-B2-01', data: sensor('00:1B:44:AA:02:03', 'temperature', 22.1, '°C') },
                  { key: 'eu-ber-b2-temp2', label: 'Temp-Sensor-B2-02', data: sensor('00:1B:44:AA:02:04', 'temperature', 23.4, '°C') },
                  { key: 'eu-ber-b2-temp3', label: 'Temp-Sensor-B2-03', data: sensor('00:1B:44:AA:02:05', 'temperature', 22.8, '°C') },
                ],
              },
            ],
          },
        ],
      },
      {
        key: 'na',
        label: 'Nordamerika',
        expanded: false,
        icon: 'pi pi-map',
        children: [
          {
            key: 'na-use',
            label: 'Rechenzentrum Virginia',
            icon: 'pi pi-building',
            children: [
              {
                key: 'na-use-v1',
                label: 'Rack V1',
                icon: 'pi pi-th-large',
                children: [
                  {
                    key: 'na-use-v1-sw',
                    label: 'Core-Switch-USE-01',
                    data: device({
                      type: 'switch',
                      mac: '00:1B:44:11:50:01',
                      ip: '10.30.0.1',
                      online: true,
                      lastSeen: 'Gerade eben',
                      firmware: 'switch-os v2.2.0',
                      rackPosition: 'V1-U12',
                      telemetry: { cpu: 30, ram: 36, tempC: 37.5, throughputMbps: 1620, uptimeDays: 95 },
                    }),
                  },
                  {
                    key: 'na-use-v1-r',
                    label: 'Edge-Router-USE',
                    data: device({
                      type: 'router',
                      mac: '00:1B:44:22:50:01',
                      ip: '10.30.0.254',
                      online: true,
                      lastSeen: 'Gerade eben',
                      firmware: 'route-os v4.1.6',
                      rackPosition: 'V1-U14',
                      telemetry: { cpu: 36, ram: 41, tempC: 39.2, throughputMbps: 1850, uptimeDays: 95 },
                    }),
                  },
                  {
                    key: 'na-use-v1-srv',
                    label: 'Server-Edge-USE-01',
                    data: device({
                      type: 'server',
                      mac: '00:1B:44:55:50:01',
                      ip: '10.30.10.11',
                      online: true,
                      lastSeen: 'Gerade eben',
                      firmware: 'bmc v3.9.0',
                      rackPosition: 'V1-U02',
                      telemetry: { cpu: 48, ram: 55, tempC: 49.0, throughputMbps: 380, uptimeDays: 41 },
                    }),
                  },
                ],
              },
            ],
          },
          {
            key: 'na-ny',
            label: 'Edge-Standort New York',
            icon: 'pi pi-building',
            children: [
              {
                key: 'na-ny-r',
                label: 'Edge-Router-NY',
                data: device({
                  type: 'router',
                  mac: '00:1B:44:22:60:01',
                  ip: '10.40.0.254',
                  online: true,
                  state: 'warn',
                  lastSeen: 'Gerade eben',
                  firmware: 'route-os v4.1.4',
                  telemetry: { cpu: 51, ram: 47, tempC: 43.0, throughputMbps: 720, uptimeDays: 28 },
                }),
              },
            ],
          },
        ],
      },
      {
        key: 'apac',
        label: 'Asien-Pazifik',
        expanded: false,
        icon: 'pi pi-map',
        children: [
          {
            key: 'apac-sin',
            label: 'Rechenzentrum Singapore',
            icon: 'pi pi-building',
            children: [
              {
                key: 'apac-sin-s1',
                label: 'Rack S1',
                icon: 'pi pi-th-large',
                children: [
                  {
                    key: 'apac-sin-s1-sw',
                    label: 'Core-Switch-SIN-01',
                    data: device({
                      type: 'switch',
                      mac: '00:1B:44:11:70:01',
                      ip: '10.50.0.1',
                      online: true,
                      lastSeen: 'Gerade eben',
                      firmware: 'switch-os v2.2.0',
                      rackPosition: 'S1-U12',
                      telemetry: { cpu: 33, ram: 37, tempC: 41.0, throughputMbps: 1410, uptimeDays: 142 },
                    }),
                  },
                  {
                    key: 'apac-sin-s1-srv',
                    label: 'Server-Edge-SIN-01',
                    data: device({
                      type: 'server',
                      mac: '00:1B:44:55:70:01',
                      ip: '10.50.10.11',
                      online: true,
                      lastSeen: 'Gerade eben',
                      firmware: 'bmc v3.9.0',
                      rackPosition: 'S1-U02',
                      telemetry: { cpu: 45, ram: 51, tempC: 48.0, throughputMbps: 360, uptimeDays: 88 },
                    }),
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }
}
