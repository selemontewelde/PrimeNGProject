import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { TreeModule } from 'primeng/tree';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { TreeNode, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TreeModule,
    TableModule,
    ButtonModule,
    BreadcrumbModule,
    TagModule,
    InputTextModule,
  ],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  nodes!: TreeNode[];
  selectedNode!: TreeNode | null;

  breadcrumbItems: MenuItem[] = [];
  softwareList = [
    { name: 'Firmware OS', version: 'v2.1.4', updateAvailable: true, newVersion: 'v2.2.0' },
    { name: 'Security Patch', version: '2023-11', updateAvailable: false, newVersion: '' },
    { name: 'Web Interface', version: 'v1.0.8', updateAvailable: true, newVersion: 'v1.1.0' },
  ];

  ngOnInit() {
    this.nodes = [
      {
        key: '0',
        label: 'Europa',
        expanded: true,
        children: [
          {
            key: '0-0',
            label: 'Rechenzentrum Frankfurt',
            expanded: true,
            children: [
              {
                key: '0-0-0',
                label: 'Core-Switch-01',
                data: {
                  isDevice: true,
                  mac: '00:1B:44:11:3A:B7',
                  online: true,
                  lastSeen: 'Gerade eben',
                },
                children: [
                  { key: '0-0-0-0', label: 'Port 1 (Uplink)', data: { isDevice: false } },
                  { key: '0-0-0-1', label: 'Port 2 (Server-Rack)', data: { isDevice: false } },
                ],
              },
              {
                key: '0-0-1',
                label: 'Router-Gateway',
                data: {
                  isDevice: true,
                  mac: '00:1B:44:99:FF:01',
                  online: false,
                  lastSeen: 'Gestern, 14:32 Uhr',
                },
                children: [{ key: '0-0-1-0', label: 'WAN Interface', data: { isDevice: false } }],
              },
            ],
          },
        ],
      },
    ];

    this.selectedNode = this.nodes[0].children![0].children![0];
    this.updateBreadcrumbs();
  }

  onNodeSelect(event: any) {
    this.updateBreadcrumbs();
  }

  updateBreadcrumbs() {
    if (this.selectedNode) {
      this.breadcrumbItems = [
        { label: 'Europa' },
        { label: 'Frankfurt' },
        { label: this.selectedNode.label },
      ];
    }
  }

  triggerUpdate(software: any) {
    alert(`Update für ${software.name} auf ${software.newVersion} wird gestartet...`);
  }

  deleteDevice() {
    alert(`Gerät ${this.selectedNode?.label} wird gelöscht!`);
  }
}
