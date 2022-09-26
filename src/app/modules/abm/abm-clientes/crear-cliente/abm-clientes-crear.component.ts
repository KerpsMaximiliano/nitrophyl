import { animate, state, style, transition, trigger } from "@angular/animations";
import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { RemoveDialogComponent } from "app/modules/prompts/remove/remove.component";
import { Cliente } from "app/shared/models/cliente.model";
import { ClientesService } from "app/shared/services/clientes.service";
import { Subscription } from "rxjs";
import { ABMClientesService } from "../abm-clientes.service";

@Component({
    selector: 'abm-clientes-crear',
    templateUrl: './abm-clientes-crear.component.html'
})

export class ABMClientesCrearComponent implements OnInit, OnDestroy, AfterViewInit {
    clienteForm: FormGroup;
    component: string = "CreateCliente";
    suscripcion: Subscription;



    constructor(
        private clientesService: ClientesService,
        private formBuilder: FormBuilder,
        private ABMClientesService: ABMClientesService,
        public dialog: MatDialog,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.clienteForm = this.formBuilder.group({
            razonSocial: [null, [Validators.required]],
            mail: [null, [Validators.required]],
            cuit: [null, [Validators.required]],
            direccion: [null, [Validators.required]],
            codigoPostal: [null, [Validators.required]],
            localidad: [null, [Validators.required]],
            celular: [null, [Validators.required]],
            telefono: [null, [Validators.required]],
            pagina: [null, [Validators.required]],
            ingresosBrutos: [null, [Validators.required]]
        });
        this.suscripcion = this.ABMClientesService.events.subscribe(
            (data: any) => {
                if (data == 1) {
                    this.close();
                } else if (data == 4) {
                    this.create();
                }
            }
        )
    }

    ngOnInit(): void {
        
    }

    ngAfterViewInit() {
        let top = document.getElementById('top');
        if (top !== null) {
            top.scrollIntoView();
            top = null;
        }
    }

    ngOnDestroy(): void {
        this.suscripcion.unsubscribe()
    }

    create() {
        this.clienteForm.markAllAsTouched();
        if(!this.clienteForm.valid) {
            return;
        };
        let model: Cliente = {
            ...this.clienteForm.getRawValue(),
            id: 0
        };
        this.clientesService.createCliente(model).subscribe(d => {
            if(d.status == "OK") {
                this.openSnackBar("Cambios realizados", "X", "green-snackbar");
            } else {
                this.openSnackBar("No se puedieron realizar los cambios", "X", "red-snackbar");
            }
        },
        err => {
            this.openSnackBar("No se puedieron realizar los cambios", "X", "red-snackbar");
        })
    }

    verContacto() {
        console.log();
    }

    close() {
        if (this.clienteForm.pristine == true) {
            this.router.navigate(['/clientes/grid'])
        } else {
            const dialogRef = this.dialog.open(RemoveDialogComponent, {
                maxWidth: '50%',
                data: { data: null, seccion: "cliente", boton: "Cerrar" },
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.router.navigate(['/clientes/grid']);
                }
            });
        }
    }

    openSnackBar(message: string, action: string, className: string) {
        this.snackBar.open(message, action, {
            duration: 5000,
            panelClass: className
        });
    };
}