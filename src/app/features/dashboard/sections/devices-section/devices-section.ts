import { Component, ViewChild, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { Tree, TreeModule, TreeNodeDropEvent } from 'primeng/tree';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem, TreeNode } from 'primeng/api';

import { DataService } from '../../../../core/data.service';
import { DEVICE_TYPE_ICON, DeviceData } from '../../../../core/models';
import { StatusDot } from '../../../../shared/status-dot/status-dot';

@Component({
  selector: 'app-devices-section',
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
    IconFieldModule,
    InputIconModule,
    ProgressBarModule,
    TooltipModule,
    StatusDot,
  ],
  templateUrl: './devices-section.html',
})
export class DevicesSection {
  readonly data = inject(DataService);
  @ViewChild('tree') tree?: Tree;

  readonly icons = DEVICE_TYPE_ICON;

  readonly softwareList = [
    { name: 'Firmware OS', version: 'v2.1.4', updateAvailable: true, newVersion: 'v2.2.0' },
    { name: 'Security Patch', version: '2023-11', updateAvailable: false, newVersion: '' },
    { name: 'Web Interface', version: 'v1.0.8', updateAvailable: true, newVersion: 'v1.1.0' },
    { name: 'Monitoring Agent', version: 'v0.9.2', updateAvailable: true, newVersion: 'v1.0.0' },
  ];

  readonly breadcrumbItems = computed<MenuItem[]>(() => {
    const node = this.data.selectedNode();
    if (!node) return [];
    return this.findPath(this.data.nodes(), node.key!) ?? [];
  });

  readonly selectedDevice = computed<DeviceData | null>(() => {
    const n = this.data.selectedNode();
    if (n?.data?.isDevice) return n.data as DeviceData;
    return null;
  });

  onNodeSelect(_event: any) {
    // selectedNode is two-way bound to data.selectedNode signal via getter/setter
  }

  get selectedNode() {
    return this.data.selectedNode();
  }
  set selectedNode(v: TreeNode | null) {
    this.data.select(v);
  }

  filterTree(value: string) {
    if (this.tree) {
      this.tree.filterMode = 'lenient';
      this.tree._filter(value);
    }
  }

  expandAll() {
    const nodes = this.data.nodes();
    this.walk(nodes, (n) => (n.expanded = true));
    this.data.setNodes([...nodes]);
  }

  collapseAll() {
    const nodes = this.data.nodes();
    this.walk(nodes, (n) => (n.expanded = false));
    this.data.setNodes([...nodes]);
  }

  onNodeDrop(event: TreeNodeDropEvent) {
    event.accept?.();
  }

  triggerUpdate(sw: any) {
    alert(`Update für ${sw.name} auf ${sw.newVersion} wird gestartet…`);
  }

  deleteDevice() {
    const n = this.data.selectedNode();
    if (n) alert(`Gerät ${n.label} wird gelöscht!`);
  }

  iconFor(node: TreeNode): string {
    if (node.icon) return node.icon as string;
    const d = node.data as DeviceData | undefined;
    if (d?.isDevice && d.type) return this.icons[d.type];
    return 'pi pi-circle';
  }

  private walk(nodes: TreeNode[], fn: (n: TreeNode) => void) {
    for (const n of nodes) {
      fn(n);
      if (n.children) this.walk(n.children, fn);
    }
  }

  private findPath(nodes: TreeNode[], key: string, path: MenuItem[] = []): MenuItem[] | null {
    for (const n of nodes) {
      const next = [...path, { label: n.label }];
      if (n.key === key) return next;
      if (n.children) {
        const r = this.findPath(n.children, key, next);
        if (r) return r;
      }
    }
    return null;
  }
}
