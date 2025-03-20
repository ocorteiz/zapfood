import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { CommonModule } from '@angular/common';
import { LojaService } from '../../../../core/services/loja/loja.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loja',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './loja.component.html',
  styleUrls: ['./loja.component.scss']
})
export class LojaComponent implements OnInit {

  ngOnInit(): void {
    this.show()
  }

  #lojaService = inject(LojaService);
  #router = inject(Router);
  private fb = inject(FormBuilder);

  erro: string = "";

  lojaForm: FormGroup;
  imageFile: File | null = null;
  imagePreview: string | null = null;

  constructor() {
    this.lojaForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      endereco: ['', Validators.required],
      corDeTema: ['', Validators.required],
      linkDeWhatsapp: ['', Validators.required],
      diaInicio: ['', Validators.required],
      diaFim: ['', Validators.required],
      horarioInicio: ['', Validators.required],
      horarioFim: ['', Validators.required],
    });
  }

  getImageUrl(caminhoImagem: string): string {
    return `http://localhost:8080/${caminhoImagem}`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  onHoraripInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    value = value.substring(0, 4);

    let hours = value.substring(0, 2);
    let minutes = value.substring(2, 4);

    if (parseInt(hours) > 23) {
      hours = '23';
    }

    if (parseInt(minutes) > 59) {
      minutes = '59';
    }

    input.value = `${hours}:${minutes}`;
  }

  onSubmitCadastro(): void {
    this.erro = ""

    const validations = [
      { isValid: () => this.lojaForm.get('nome')?.value !== '', message: 'O nome da loja é obrigatório' },
      { isValid: () => this.lojaForm.get('descricao')?.value !== '', message: 'A descrição da loja é obrigatória' },
      { isValid: () => this.lojaForm.get('endereco')?.value !== '', message: 'O endereço da loja é obrigatório' },
      { isValid: () => !!this.lojaForm.get('corDeTema')?.value, message: 'A cor do tema é obrigatória' },
      { isValid: () => this.lojaForm.get('linkDeWhatsapp')?.value !== '', message: 'O link de WhatsApp é inválido' },
      { isValid: () => this.lojaForm.get('diaInicio')?.value !== '', message: 'O dia de abertura é obrigatório' },
      { isValid: () => this.lojaForm.get('diaFim')?.value !== '', message: 'O dia de fechamento é obrigatório' },
      { isValid: () => this.lojaForm.get('horarioInicio')?.value, message: 'O horário de abertura é inválido' },
      { isValid: () => this.lojaForm.get('horarioFim')?.value, message: 'O horário de fechamento é inválido' },
    ];

    const invalidField = validations.find(validation => !validation.isValid());

    if (invalidField) {
      this.erro = invalidField.message;
      return;
    }

    if (!this.imageFile) {
      this.erro = "A LOGO DA LOJA É OBRIGATORIO"
      return;
    }

    const formData = new FormData();
    formData.append('nome', this.lojaForm.get('nome')?.value);
    formData.append('descricao', this.lojaForm.get('descricao')?.value);
    formData.append('endereco', this.lojaForm.get('endereco')?.value);
    formData.append('logo', this.imageFile);
    formData.append('corDeTema', this.lojaForm.get('corDeTema')?.value);
    formData.append('linkDeWhatsapp', this.lojaForm.get('linkDeWhatsapp')?.value);
    formData.append('diaInicio', this.lojaForm.get('diaInicio')?.value);
    formData.append('diaFim', this.lojaForm.get('diaFim')?.value);
    formData.append('horarioInicio', this.lojaForm.get('horarioInicio')?.value);
    formData.append('horarioFim', this.lojaForm.get('horarioFim')?.value);


    this.#lojaService.httpCreate$(formData).subscribe({
      next: () => {
        location.reload()
      },
      error: (error) => console.log('error: ', error)
    });
  }

  onSubmitUpdate(): void {
    this.erro = '';
    const loja = this.getLoja();

    if (!loja) {
      this.erro = 'Os dados da loja não foram carregados!';
      return;
    }

    const validations = [
      { isValid: () => loja.nome.trim() !== '', message: 'O nome da loja é obrigatório.' },
      { isValid: () => loja.descricao.trim() !== '', message: 'A descrição da loja é obrigatória.' },
      { isValid: () => loja.endereco.trim() !== '', message: 'O endereço da loja é obrigatório.' },
      { isValid: () => !!loja.corDeTema, message: 'A cor do tema é obrigatória.' },
      { isValid: () => loja.linkDeWhatsapp.trim() !== '', message: 'O link de WhatsApp é inválido.' },
      { isValid: () => loja.diaInicio.trim() !== '', message: 'O dia de abertura é obrigatório.' },
      { isValid: () => loja.diaFim.trim() !== '', message: 'O dia de fechamento é obrigatório.' },
      { isValid: () => loja.horarioInicio, message: 'O horário de abertura é inválido.' },
      { isValid: () => loja.horarioFim, message: 'O horário de fechamento é inválido.' },
    ];

    const invalidField = validations.find(validation => !validation.isValid());

    if (invalidField) {
      this.erro = invalidField.message;
      return;
    }

    const formData = new FormData();
    formData.append('nome', loja.nome);
    formData.append('descricao', loja.descricao);
    formData.append('endereco', loja.endereco);

    if (this.imageFile) {
      formData.append('logo', this.imageFile);
    }

    formData.append('corDeTema', loja.corDeTema);
    formData.append('linkDeWhatsapp', loja.linkDeWhatsapp);
    formData.append('diaInicio', loja.diaInicio);
    formData.append('diaFim', loja.diaFim);
    formData.append('horarioInicio', loja.horarioInicio);
    formData.append('horarioFim', loja.horarioFim);

    this.#lojaService.httpUpdate$(formData).subscribe({
      next: () => {
        location.reload()
      },
      error: (error) => console.log('error: ', error)
    });

  }

  public getLoja = signal<ILoja | null>(null);

  show(): void {
    this.#lojaService.httpFind$().subscribe({
      next: (data) => {
        this.getLoja.set(data)
      },
      error: (error) => console.log("error: ", error.error.message)
    })
  }

  updateStatus(): void {
    this.#lojaService.httpUpdateStatus$().subscribe({
      next: () => {
        this.show()
      },
      error: (error) => console.log("error: ", error.error.message)
    })
  }

  logout(): void {
    this.#lojaService.httpLogout$().subscribe({
      next: () => {

        localStorage.removeItem('data')
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')

        this.#router.navigate(['/admin/login'])
      },
      error: (error) => {
        console.log("error : ", error.error.message)
      }
    })
  }

}
