import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'combine',
    templateUrl: './combine.component.html',
    styleUrls: ['./combine.component.less']
})
export class CombineComponent implements OnInit {
    query =[];
    qry = [];
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
    
    submitting = false;

    constructor( private msg: NzMessageService) { }

    ngOnInit() {
        
    }
    backspace(){
        this.query.pop();
        this.qry.pop();
        
    }
    reset(){
        this.query = [];
        this.qry = [];
    }
    addColumn(id){
        this.query.push(this.data[id]);
    }
    addColumn1(id){
        this.qry.push(this.data[id]);
    }
    submit() { 
        
        setTimeout(() => {
            this.msg.success(`Submitted successfully`);
        }, 1000);
    }

}
