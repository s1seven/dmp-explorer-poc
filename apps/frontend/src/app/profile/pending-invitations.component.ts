import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationDto } from '../shared/models';

@Component({
  selector: 'app-pending-invitations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex gap-2 mb-10 rounded-md p-4 border border-gray-300 flex-col max-w-3xl"
      *ngIf="this.invitations() as invitations"
    >
      <h2>Currently pending invitations:</h2>
      <ul>
        <li *ngFor="let invitation of invitations">
          {{ invitation.emailToInvite }}
        </li>
      </ul>
    </div>
  `,
  styles: ``,
})
export class PendingInvitationsComponent {
  readonly invitations = input.required<InvitationDto[]>();
}
