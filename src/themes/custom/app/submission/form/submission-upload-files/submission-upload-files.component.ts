import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { UploaderComponent } from '../../../../../../app/shared/upload/uploader/uploader.component';
import { SubmissionUploadFilesComponent as BaseComponent } from '../../../../../../app/submission/form/submission-upload-files/submission-upload-files.component';
import { FilePreviewPanelComponent } from '../../../../../../app/shared/upload/file-preview-panel/file-preview-panel.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-themed-submission-upload-files',
  // templateUrl: './submission-upload-files.component.html',
  templateUrl: '../../../../../../app/submission/form/submission-upload-files/submission-upload-files.component.html',
  imports: [
    UploaderComponent,
    FilePreviewPanelComponent,
    CommonModule,
    TranslateModule
  ],
  standalone: true,
})
export class SubmissionUploadFilesComponent extends BaseComponent {
  onFileSelectedForPreview(file: any) {
    super.onFileSelectedForPreview(file);
  }
}
