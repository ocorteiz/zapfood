import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ICupomCreate } from '../../../../core/interfaces/ICupom.interface';
import { CupomService } from '../../../../core/services/cupom/cupom.service';

@Component({
  selector: 'app-form-cupom',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-cupom.component.html',
  styleUrl: './form-cupom.component.scss'
})
export class FormCupomComponent {

  #cupomService = inject(CupomService);
  @Output() close = new EventEmitter<void>();
  @Output() messageEvent = new EventEmitter<string | null>()

  cupomForm: FormGroup;
  public fb = inject(FormBuilder);

  message: string | null = null
  erro: string = '';

  closeModal() {
    this.close.emit()
    this.messageEvent.emit(this.message)
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const selectedDate = new Date(value);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { futureDate: true };
    }

    return null;
  }

  constructor() {
    this.cupomForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      valor: [null, [Validators.required, Validators.min(1)]],
      valorParaPedido: [null, [Validators.required, Validators.min(1)]],
      resgatavel: [null, [Validators.required, Validators.min(1)]],
      dataDeValidade: [null, [Validators.required, this.futureDateValidator]],
    })
  }

  onSubmit(): void {
    this.erro = '';

    const validations = [
      {isValid: () => this.cupomForm.get("nome")?.value !== '', message: "NOME É OBRIGATÓRIO"},
      {isValid: () => this.cupomForm.get('descricao')?.value !== '', message: "DESCRIÇÃO É OBRIGATÓRIO"},
      {isValid: () => {
        const valor = this.cupomForm.get('valor')?.value;
        return valor !== null && valor !== undefined && valor > 0
      }, message: "VALOR É OBRIGATÓRIO"},
      {isValid: () => {
        const valorParaPedido = this.cupomForm.get('valorParaPedido')?.value;
        return valorParaPedido !== null && valorParaPedido !== undefined && valorParaPedido > -1
      }, message: "VALOR PARA PEDIDO É OBRIGATÓRIO"},
      {isValid: () => {
        const resgatavel = this.cupomForm.get('resgatavel')?.value;
        return resgatavel !== null
      }, message: "TIPO DE CUPOM É OBRIGATÓRIO"},
      {isValid: () => {
        const dataDeValidade = this.cupomForm.get('dataDeValidade')?.value;
        return dataDeValidade !== null && dataDeValidade !== undefined
      }, message: "DATA DE VALIDADE É OBRIGATÓRIO"},
      {isValid: () => !this.cupomForm.get('dataDeValidade')?.errors?.['futureDate'], message: "DATA DE VALIDADE DEVE SER UMA DATA FUTURA"}
    ]

    const invalidField = validations.find(validation => !validation.isValid())

    if (invalidField) {
      this.erro = invalidField.message
      return
    }

    const cupom: ICupomCreate = this.cupomForm.value


    this.httpCreateCupom(cupom)

  }

  httpCreateCupom(cupom: ICupomCreate): void {
    this.#cupomService.httpCreateCupom$(cupom).subscribe({
      next: () => {
        {
          this.message = "CUPOM CADASTRADO COM SUCESSO"
          this.closeModal()
        }
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

}
