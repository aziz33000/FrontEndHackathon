import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'group-by',
    templateUrl: './group-by.component.html',
    styleUrls: ['./group-by.component.less']
})
export class GroupByComponent implements OnInit {
    data1 =[];
    data2 =[];     
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

    checked1= Array<boolean>(this.data.length).fill(false);
    checked2= Array<boolean>(this.data.length).fill(false);
    
    operators = [
        {
            id:0,
            name : 'MAX'
        },{
            id:1,
            name : 'MIN'
        },{
            id:2,
            name : 'FST'
        },{
            id:3,
            name : 'AVG'
        }
    ];
    submitting = false;

    constructor( private msg: NzMessageService) { }

    ngOnInit() {
        
    }
    addfirstfield(id){
        if (this.checked1[id]){
            this.data1.push(this.data[id]);}
    }
    addsecondfield(id){
        if (this.checked2[id]){
            this.data2.push(this.data[id]);}
    }
    submit() { 
        
        setTimeout(() => {
            this.msg.success(`Submitted successfully`);
        }, 1000);
    }

}
