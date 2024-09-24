import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface DialogData {
  title: string;
  snippet: string;
}

@Component({
  selector: 'app-main-table',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './main-table.component.html',
  styleUrl: './main-table.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MainTableComponent implements OnInit {
  
  readonly dialog = inject(MatDialog);

  searchInput = 'Angular';
  searchTerm = '';
  // showItemsNumber = 10;
  results: any[] = [];
  totalHits = 0;
  continueToken : string | undefined;
  offset: number | undefined;
  isContinue = false;

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.searchData();
  }

  searchData(){
    this.apiService.getData(this.searchInput).subscribe(data => {
      this.results = data.query.search;
      this.totalHits = data.query.searchinfo.totalhits;
      this.isContinue = !!data.continue;
      this.continueToken = data.continue?.continue;
      this.offset = data.continue?.sroffset;
      this.searchTerm = this.searchInput;
    });
  }
  
  loadMoreData(){
    this.isContinue = false;
    this.apiService.getData(this.searchInput, this.continueToken, this.offset).subscribe(data => {
      this.searchTerm = this.searchInput;
      this.results = [...this.results, ...data.query.search];
      this.isContinue = !!data.continue;
      this.continueToken = data.continue?.continue;
      this.offset = data.continue?.sroffset;
    });
  }

  openDialog(data: any) {
    const dialogRef = this.dialog.open(MainTableDialog, {
      data: {
        title: data.sectiontitle ? data.sectiontitle : data.title,
        snippet: data.sectionsnippet ? data.sectionsnippet : data.snippet
      }
    })
    
  }
}

@Component({
  selector: 'main-table-dialog',
  templateUrl: 'main-table-dialog.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainTableDialog {
  readonly dialogRef = inject(MatDialogRef<MainTableDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
}