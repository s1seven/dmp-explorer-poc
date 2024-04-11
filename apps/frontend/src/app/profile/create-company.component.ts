import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-company',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <form class="rounded-md p-4 border border-gray-300 flex flex-col max-w-3xl">
      <p class="text-gray-700 mb-6 flex gap-2">
        <span
          ><mat-icon fontIcon="info" [inline]="true" class="inline"></mat-icon
        ></span>
        If your company is already registered, please contact your administrator
        to invite you to join the team. If you wish to create a new company,
        please fill in the following form.
      </p>
      <mat-form-field>
        <mat-label>Company Name</mat-label>
        <input matInput />
      </mat-form-field>
      <mat-form-field>
        <mat-label>VAT Id</mat-label>
        <input matInput placeholder="e.g. DE123456789" />
      </mat-form-field>
      <div class="flex gap-3">
        <button mat-raised-button color="primary">Create Company</button>
      </div>
    </form>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCompanyComponent {}
