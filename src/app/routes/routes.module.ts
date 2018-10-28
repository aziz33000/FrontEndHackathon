import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { RouteRoutingModule } from './routes-routing.module';
import { NodeInputfileComponent } from './node-inputfile';
import { NodeParamsetComponent } from './node-paramset';
import { CombineComponent } from './combine';
import { GroupByComponent } from './group-by';

import { NodeSelectfileComponent } from './node-selectfile';
import { LayoutDefaultComponent } from './default/default.component';

const COMPONENTS = [NodeInputfileComponent, NodeParamsetComponent,CombineComponent,GroupByComponent, NodeSelectfileComponent, LayoutDefaultComponent];
const COMPONENTS_NOROUNT = [NodeInputfileComponent, NodeParamsetComponent,CombineComponent , GroupByComponent, NodeSelectfileComponent];

@NgModule({
    imports: [SharedModule, RouteRoutingModule],
    declarations: COMPONENTS,
    entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule { }
