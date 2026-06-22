import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, addOutline, closeOutline, saveOutline } from 'ionicons/icons';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { ChildService } from '../../../core/services/child.service';
import { ChildVaccineItem } from '../../../shared/model/child';
import { getVaccinationSummary } from '../../../shared/utils/vaccination-status';

interface FormVaccine {
  vaccineId: string;
  vaccineName: string;
  applied: boolean;
  scheduledDate: string;
  applicationDate: string;
}

interface FormData {
  name: string;
  birthDate: string;
  responsible: string;
  totalVaccines: number;
  appliedVaccines: number;
  pendingVaccines: number;
  vaccines: FormVaccine[];
}

function toDateInput(d: Date): string {
  return d.toISOString().split('T')[0];
}

@Component({
  selector: 'app-children-form',
  standalone: true,
  imports: [CommonModule, RouterLink, IonIcon, PageHeaderComponent, LoadingStateComponent],
  templateUrl: './children-form.component.html',
  styleUrl: './children-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenFormComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private childService = inject(ChildService);

  protected isEditMode = signal(false);
  protected loading = signal(false);
  protected saving = signal(false);
  protected message = signal('');
  protected isError = signal(false);

  protected form = signal<FormData>({
    name: '',
    birthDate: '',
    responsible: '',
    totalVaccines: 0,
    appliedVaccines: 0,
    pendingVaccines: 0,
    vaccines: [],
  });

  constructor() {
    addIcons({ arrowBackOutline, addOutline, closeOutline, saveOutline });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.loadChild(id);
    }
  }

  private loadChild(id: string): void {
    this.loading.set(true);
    this.childService
      .getChildById(id)
      .pipe(take(1))
      .subscribe({
        next: (child) => {
          this.form.set({
            name: child.name,
            birthDate: toDateInput(child.birthDate),
            responsible: child.responsible || '',
            totalVaccines: child.totalVaccines,
            appliedVaccines: child.appliedVaccines,
            pendingVaccines: child.pendingVaccines,
            vaccines: (child.vaccines || []).map((v) => ({
              vaccineId: v.vaccineId,
              vaccineName: v.vaccineName,
              applied: v.applied,
              scheduledDate: toDateInput(v.scheduledDate),
              applicationDate: v.applicationDate ? toDateInput(v.applicationDate) : '',
            })),
          });
          this.loading.set(false);
        },
        error: () => {
          this.message.set('Erro ao carregar dados da criança');
          this.isError.set(true);
          this.loading.set(false);
        },
      });
  }

  protected addVaccine(): void {
    this.form.update((f) => ({
      ...f,
      vaccines: [
        ...f.vaccines,
        {
          vaccineId: `v${f.vaccines.length + 1}`,
          vaccineName: '',
          applied: false,
          scheduledDate: '',
          applicationDate: '',
        },
      ],
    }));
  }

  protected removeVaccine(index: number): void {
    this.form.update((f) => ({
      ...f,
      vaccines: f.vaccines.filter((_, i) => i !== index),
    }));
  }

  protected updateVaccine(index: number, field: keyof FormVaccine, value: any): void {
    this.form.update((f) => {
      const vaccines = [...f.vaccines];
      vaccines[index] = { ...vaccines[index], [field]: value };
      return { ...f, vaccines };
    });
  }

  protected updateForm(field: keyof FormData, value: any): void {
    this.form.update((f) => ({ ...f, [field]: value }));
  }

  protected totalFormVaccines(): number {
    return this.form().vaccines.length;
  }

  protected appliedFormVaccines(): number {
    return this.form().vaccines.filter((vaccine) => vaccine.applied).length;
  }

  protected pendingFormVaccines(): number {
    return this.form().vaccines.filter((vaccine) => !vaccine.applied).length;
  }

  protected async save(): Promise<void> {
    const f = this.form();
    if (!f.name || !f.birthDate) {
      this.message.set('Preencha pelo menos nome e data de nascimento');
      this.isError.set(true);
      return;
    }

    this.saving.set(true);
    this.message.set('');
    this.isError.set(false);

    const vaccines: ChildVaccineItem[] = f.vaccines
      .filter((v) => v.vaccineName && v.scheduledDate)
      .map((v) => ({
        vaccineId: v.vaccineId,
        vaccineName: v.vaccineName,
        applied: v.applied,
        scheduledDate: new Date(v.scheduledDate),
        ...(v.applicationDate ? { applicationDate: new Date(v.applicationDate) } : {}),
      }));
    const summary = getVaccinationSummary(vaccines);

    const childData = {
      name: f.name,
      birthDate: new Date(f.birthDate),
      responsible: f.responsible || undefined,
      totalVaccines: summary.total,
      appliedVaccines: summary.applied,
      pendingVaccines: summary.pending + summary.overdue,
      vaccines,
    };

    try {
      if (this.isEditMode()) {
        const id = this.route.snapshot.paramMap.get('id')!;
        await this.childService.updateChild(id, childData);
        this.message.set('Criança atualizada com sucesso!');
      } else {
        await this.childService.addChild(childData);
        this.message.set('Criança cadastrada com sucesso!');
      }
      setTimeout(() => this.router.navigate(['/children']), 1500);
    } catch (err) {
      this.message.set('Erro ao salvar: ' + err);
      this.isError.set(true);
    } finally {
      this.saving.set(false);
    }
  }
}
