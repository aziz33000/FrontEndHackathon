import { Component, OnInit, } from '@angular/core';
import * as $ from 'jquery';
import * as d3 from 'd3'
declare const jsPlumb: any;
import { DndDropEvent } from 'ngx-drag-drop';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { Tools } from '@domain';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { NodeInputfileComponent } from '../node-inputfile';
import { NodeParamsetComponent } from '../node-paramset';
import { NodeSelectfileComponent } from '../node-selectfile';
import { CombineComponent } from "../combine";
import { GroupByComponent } from "../group-by";
@Component({
    selector: 'WorkflowManage',
    templateUrl: './default.component.html',
})
export class LayoutDefaultComponent implements OnInit {

    tplModal: NzModalRef;
    code = 0;
    active = 0;
    tools$: Observable<Tools[]>;
    tool$: Observable<Tools>;
    offx = 0;
    offy = 0;
    lastDropEvent: DndDropEvent[] = [];
    currentNodeData;
    instance;

    constructor(private http: _HttpClient, private msg: NzMessageService, private modalService: NzModalService) {

    }

    getTools = (type: number) => {
        this.tools$ = this.http.post('/tool', { type: type });
        this.active = type;
    }

    ngOnInit() {
        this.getTools(this.active);
        let that = this;
        jsPlumb.ready(function () {
            let color = "rgba(255, 255, 255, 0.29)";
            that.instance = jsPlumb.getInstance({
                Connector: ["Bezier", { curviness: 50 }],
                DragOptions: { cursor: "pointer", zIndex: 2000 },
                PaintStyle: {
                    strokeStyle: color, lineWidth: 2
                },
                Overlays: [["PlainArrow", { location: 1, width: 12, length: 12 }]],
                Endpoint: ["Dot", { radius: 8 }],
                AnchorStyle : {fillStyle:"rgba(255,255,255,0.19)"},
                HoverAnchorStyle : {fillStyle:"rgba(255,255,255,0.39)"},
                EndpointStyle: { fillStyle: "rgba(255, 255, 255, 0.19)" },
                HoverPaintStyle: { strokeStyle: "rgba(255, 255, 255, 0.59)" },
                EndpointHoverStyle: { fillStyle: "rgba(255, 255, 255, 0.59)" },
                Container: "flow-panel"
            });
            that.instance.bind("connection", function (connInfo, originalEvent) {
                that.http.post('/tool/check', { sourcenode: connInfo.connection.sourceId.split('-')[1], targetnode: connInfo.connection.targetId.split('-')[1] }).subscribe(res => {
                    if (!res) {
                        that.msg.error('The output file format does not match the input format of the target tool, please re-select!', { nzDuration: 3000 });
                        jsPlumb.detach(connInfo.connection);
                    }
                });
            });
            $('#flow-panel').on('drop', function (ev) {
                if (ev.target.className.indexOf('_jsPlumb') >= 0) {
                    return;
                }
                ev.preventDefault();
                let mx = '' + (ev.originalEvent.offsetX - that.offx) + 'px';
                let my = '' + (ev.originalEvent.offsetY - that.offy) + 'px';
                let node = that.addNode(that.instance, that.code + "-" + that.currentNodeData.id, that.currentNodeData, { x: mx, y: my });
                that.addPorts(that.instance, node, ["Top", "Bottom", "Left", "Right"]);
                that.instance.draggable($(node), {
                    containment: 'parent'
                });
                that.code++;
            }).on('dragover', function (ev) {
                ev.preventDefault();
                console.log('on drag over');
            });
            jsPlumb.fire("jsFlowLoaded", that.instance);
            that.instance.bind('dblclick', function (conn) {
                jsPlumb.detach(conn)
            })
        })
    }

    addNode(instance, nodeId, data, position) {
        let panel = d3.select("#flow-panel");
        let that = this;
        panel.append('div')
            .style('position', 'absolute')
            .style('top', position.y).style('left', position.x)
            .style('width', ' 200px').style('background-color', 'rgba(0, 0, 0, 0.65)')
            .style('border-radius', '16px')
            .attr('id', nodeId).classed('node', true);
        $('#' + nodeId).hover(function () {
            $(this).removeClass("outhover").addClass("inhover");
        }, function () {
            $(this).removeClass("inhover").addClass("outhover");
        })

        /* <div id='" + nodeId + "-selectfile' title='详情'><i class='anticon anticon-profile'></i></div> */

        $('#' + nodeId).append("<div class='huangcard'><div class='zuo'><div class='title' style='color:white;'><strong>" + data.name + "</strong></div></div><div class='you'><div id='" + nodeId + "-" + data.id + "setting' title='parameter settings'><i class='anticon anticon-setting'></i></div><div id='" + nodeId + "-inputFile' title='upload files'><i class='anticon anticon-file-add'></i></div><div id='" + nodeId + "-delete' title='delete'><i class='anticon anticon-delete'></i></div></div></div>")
        
        data.inputFile ? $('#' + nodeId + '-setting').hide() : $('#' + nodeId + '-inputFile').hide();
        $('#' + nodeId + '-delete').click(function () {
            instance.detachAllConnections(nodeId);
            instance.deleteEndpoint(nodeId + "-Top");
            instance.deleteEndpoint(nodeId + "-Bottom");
            instance.deleteEndpoint(nodeId + "-Left");
            instance.deleteEndpoint(nodeId + "-Right");
            instance.remove(nodeId);
        })
        $('#' + nodeId + '-inputFile').click(function () {
            that.createInputfileModal(nodeId.split('-')[1]);
        })
        $('#' + nodeId + '-1setting').click(function () {
            that.createSettingModal(nodeId.split('-')[1]);
        })
        $('#' + nodeId + '-2setting').click(function () {
            that.createSettingCombine(nodeId.split('-')[1]);
        })
        $('#' + nodeId + '-3setting').click(function () {
            that.createSettingGroupBy(nodeId.split('-')[1]);
        })
        return jsPlumb.getSelector('#' + nodeId)[0];
    }

    selectInputfileModal(nodeId, toolId) {
        this.modalService.create({
            nzTitle: 'Input file selection',
            nzContent: NodeSelectfileComponent,
            nzComponentParams: {
                projectId: 'jiance1',
                nodeId: nodeId,
                toolId: toolId
            },
            nzMaskClosable: false,
            nzFooter: null,
            nzBodyStyle : {
                color:'#AAAAAA',
                background:'rgb(52, 58, 64)'
            }
        });
    }
    

    createInputfileModal(toolId): void {
        this.modalService.create({
            nzTitle: 'Raw data upload',
            nzContent: NodeInputfileComponent,
            nzComponentParams: {
                projectId: 'jiance1',
                toolId: toolId
            },
            nzMaskClosable: false,
            nzFooter: null,
        });
    }

    createSettingModal(toolId): void {
        this.modalService.create({
            nzTitle: 'parameter settings',
            nzContent: NodeParamsetComponent,
            nzWidth: '1080',
            nzComponentParams: {
                projectId: 'ceshicanshu1',
                toolId: toolId
            },
            nzMaskClosable: false,
            nzFooter: null,
            nzBodyStyle : {
                color:'#AAAAAA',
                background:'rgb(52, 58, 64)'
            },
            nzStyle : {
                color:'#AAAAAA',
                background:'rgb(52, 58, 64)'
            }
        });
    }
    createSettingCombine(toolId): void {
        this.modalService.create({
            nzTitle: 'parameter settings',
            nzContent: CombineComponent,
            nzWidth: '1080',
            nzComponentParams: {
                projectId: 'ceshicanshu1',
                toolId: toolId
            },
            nzMaskClosable: false,
            nzFooter: null,
            nzBodyStyle : {
                color:'#AAAAAA',
                background:'rgb(52, 58, 64)'
            },
            nzStyle : {
                color:'#AAAAAA',
                background:'rgb(52, 58, 64)'
            }
        });
    }
    createSettingGroupBy(toolId): void {
        this.modalService.create({
            nzTitle: 'parameter settings',
            nzContent: GroupByComponent,
            nzWidth: '1080',
            nzComponentParams: {
                projectId: 'ceshicanshu1',
                toolId: toolId
            },
            nzMaskClosable: false,
            nzFooter: null,
            nzBodyStyle : {
                color:'#AAAAAA',
                background:'rgb(52, 58, 64)'
            },
            nzStyle : {
                color:'#AAAAAA',
                background:'rgb(52, 58, 64)'
            }
        });
    }
    addPorts(instance, node, ports) {
        for (let i = 0; i < ports.length; i++) {
            let paintStyle = { radius: 5, fillStyle: '#D4FFD6' };
            instance.addEndpoint(node, {
                uuid: node.getAttribute("id") + "-" + ports[i],
                paintStyle: paintStyle,
                anchor: ports[i],
                maxConnections: -1,
                isSource: true,
                isTarget: true
            });
        }
    }

    onDragStart(event: DragEvent) {
        this.offx = event.offsetX;
        this.offy = event.offsetY;
    }

    onDragEnd(event: DragEvent) {
    }

    onDraggableCopied(event: DragEvent) {
    }

    onDraggableLinked(event: DragEvent) {
    }

    onDraggableMoved(event: DragEvent) {
    }

    onDragCanceled(event: DragEvent) {
    }

    onDragover(event: DragEvent) {
    }

    onDrop(event: any) {
        this.lastDropEvent.push(event);
        this.currentNodeData = event.data;
    }

    baocun() {
        let connects = [];
        let nodes = [];
        
        $.each(this.instance.getConnections(), function (idx, connection) {
            connects.push({
                ConId: connection.id,
                SourceId: connection.endpoints.map(res => res._jsPlumb.uuid)[0],
                TargetId: connection.endpoints.map(res => res._jsPlumb.uuid)[1],
            });
        });
        $("#flow-panel .node").each(function (idx, elem) {
            var $elem = $(elem);
            nodes.push({
                NodeId: $elem.attr('id'),
                PositionX: parseInt($elem.css("left"), 10),
                PositionY: parseInt($elem.css("top"), 10)
            });
        });
        var invertex = Array<number>(nodes.length);
        invertex.fill(0);
        for(let i = 0; i < connects.length; i++){
            let indice = <number> connects[i].TargetId.charAt(0);
            invertex[indice] ++;

            
        }
        var sortedinvertex = Array<number>(nodes.length);
        let max = 0 ;
        let pos = 0 ;
        let reapeted = nodes.length-1 ; 
        while (reapeted > 0 ) {
        for (let i =0 ; i < nodes.length ; i++ ) {
            if(max < invertex[i]) {
                max = invertex[i];
                pos = i ;
            }
        }  
        invertex[pos] = -1;
        sortedinvertex[reapeted] = pos;
        reapeted--;
        max = 0 ;
        }
        console.log(sortedinvertex);
        let flowChart = { nodes: nodes, connects: connects };
        var flowChartJson = JSON.stringify(flowChart);
        console.log(flowChartJson);
        
        $('#jsonOutput').val(flowChartJson);
    }

    jiazai() {
        let that = this;
        $("#flow-panel .node").each(function (idx, elem) {
            that.instance.remove($(elem).attr('id'))
        });
        if ($('#jsonInput').val() != '') {
            let flowChartJson = JSON.parse($('#jsonInput').val());
            flowChartJson.nodes.forEach((element, index) => {
                this.http.get('/tool/' + element.NodeId.split('-')[1]).subscribe(data => {
                    let node = this.addNode(this.instance, element.NodeId, data, { x: element.PositionX + 'px', y: element.PositionY + 'px' });
                    this.addPorts(this.instance, node, ["Top", "Bottom", "Left", "Right"]);
                    this.instance.draggable($(node), {
                        containment: 'parent'
                    });
                    if (index == flowChartJson.nodes.length - 1) {
                        flowChartJson.connects.forEach(element => {
                            this.instance.connect({ uuids: [element.SourceId, element.TargetId] });
                        });
                    }
                })
            })
        }
    }
}

