import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'node-paramset',
    templateUrl: './node-paramset.component.html',
    styleUrls: ['./node-paramset.component.less']
})
export class NodeParamsetComponent implements OnInit {
    query = ['SELECT']; 
    @Input() projectId: number;
    @Input() toolId: number;
    data = [
        'column 1',
        'column 2',
        'column 3',
        'column 4',
        'column 5',
        'column 6',
        'column 7',
        'column 8'
    ];
    operators = [
        {
            id:0,
            name : 'AND'
        },{
            id:1,
            name : 'OR'
        },{
            id:2,
            name : 'NOT'
        },{
            id:3,
            name : 'LIKE'
        },{
            id:4,
            name : 'WHERE'
        },{
            id:5,
            name : '+'
        },{
            id:6,
            name : '-'
        },{
            id:7,
            name : '*'
        },{
            id:8,
            name : '/'
        },{
            id:9,
            name : '('
        },{
            id:10,
            name : ')'
        },{
            id:11,
            name : 'AVG'
        },{
            id:12,
            name : 'MIN'
        },{
            id:13,
            name : 'MAX'
        }
    ];
    submitting = false;

    constructor( private msg: NzMessageService) { }

    ngOnInit() {
        
    }
    backspace(){
        if (this.query.length !=1){this.query.pop();}
        
    }
    reset(){
        this.query = [];
    }
    addOperator(id){
        this.query.push(this.operators[id].name);
    }
    addColumn(id){
        this.query.push(this.data[id]);
    }
    submit() { 
        
        setTimeout(() => {
            this.msg.success(`Submitted successfully`);
        }, 1000);
    }

}
