import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { Tree, TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { TreeNode } from 'primeng/api';

import { DataService } from '../../core/data.service';
import { LayoutService } from '../../core/layout.service';
import { DEVICE_TYPE_ICON, DeviceData } from '../../core/models';
import { StatusDot } from '../../shared/status-dot/status-dot';

@Component({
  selector: 'app-mobile-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DrawerModule,
    TreeModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TooltipModule,
    StatusDot,
  ],
  templateUrl: './mobile-drawer.html',
})
export class MobileDrawer {
  readonly data = inject(DataService);
  readonly layout = inject(LayoutService);
  readonly icons = DEVICE_TYPE_ICON;

  @ViewChild('tree') tree?: Tree;

  get visible() {
    return this.layout.drawerOpen();
  }
  set visible(v: boolean) {
    if (v) this.layout.openDrawer();
    else this.layout.closeDrawer();
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

  onSelect(_event: any) {
    this.layout.closeDrawer();
    this.layout.scrollTo('devices');
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
}
