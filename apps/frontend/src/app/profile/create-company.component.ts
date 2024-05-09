import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProfileService } from './profile.service';
import { MatCardModule } from '@angular/material/card';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, firstValueFrom } from 'rxjs';
import { CompanyDto } from '../shared/models';

@Component({
  selector: 'app-create-company',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCardModule,
  ],
  template: `
    <div
      class="flex gap-4 rounded-md p-4 border border-gray-300 flex-col max-w-3xl"
    >
      <h2>Create a Company</h2>

      <form
        class="rounded-md p-4 border border-gray-300 flex flex-col max-w-3xl"
        [formGroup]="newCompanyForm"
        (ngSubmit)="createCompany()"
      >
        <p class="text-gray-700 mb-6 flex gap-2">
          <span
            ><mat-icon fontIcon="info" [inline]="true" class="inline"></mat-icon
          ></span>
          If your company is already registered, please contact your
          administrator to invite you to join the team. If you wish to create a
          new company, please fill in the following form.
        </p>
        <mat-form-field>
          <mat-label>Company Name</mat-label>
          <input matInput type="text" formControlName="name" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>VAT Id</mat-label>
          <input
            type="text"
            matInput
            placeholder="e.g. DE123456789"
            formControlName="VAT"
          />
        </mat-form-field>
        <div class="flex gap-3">
          <button mat-raised-button color="primary">Create Company</button>
        </div>
      </form>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCompanyComponent {
  readonly newCompanyForm = new FormGroup({
    name: new FormControl('', Validators.required),
    VAT: new FormControl('', Validators.required),
  });

  constructor(private readonly profileService: ProfileService) {}

  async createCompany() {
    if (this.newCompanyForm.invalid) {
      return;
    }
    const newCompany = this.newCompanyForm.value;

    const createdCompany = await firstValueFrom(
      // TODO: fix type error
      this.profileService.createCompany(newCompany as CompanyDto).pipe(
        catchError((error) => {
          console.error('Error creating company', error);
          return [];
        })
      )
    );
    this.profileService.companies.set([createdCompany]);
  }
}
