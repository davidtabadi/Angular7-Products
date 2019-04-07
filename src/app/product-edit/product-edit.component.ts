import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  productForm: FormGroup;
  id: number = null;
  prodName = '';
  prodDesc = '';
  prodPrice: number = null;
  isLoadingResults = false;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) { }

  getProduct(id) {
    this.api.getProduct(id).subscribe(data => {
      this.id = data.id;
      this.productForm.setValue({
        prod_name: data.prodName,
        prod_desc: data.prodDesc,
        prod_price: data.prodPrice
      });
    });
  }

  onFormSubmit(form: NgForm) {
    this.isLoadingResults = true;
    this.api.updateProduct(this.id, form)
      .subscribe(res => {
        const id = res._id;
        this.isLoadingResults = false;
        this.router.navigate(['/product-details', id]);
      }, (err) => {
        console.log(err);
        this.isLoadingResults = false;
      }
      );
  }


  deleteProduct(id) {
    this.isLoadingResults = true;
    this.api.deleteProduct(id)
      .subscribe(res => {
        this.isLoadingResults = false;
        this.router.navigate(['/products']);
      }, (err) => {
        console.log(err);
        this.isLoadingResults = false;
      }
      );
  }

  productDetails() {
    this.router.navigate(['/product-details', this.id]);
  }

  ngOnInit() {
    this.getProduct(this.route.snapshot.params.id);
    this.productForm = this.formBuilder.group({
      prod_name: [null, Validators.required],
      prod_desc: [null, Validators.required],
      prod_price: [null, Validators.required]
    });
  }

}
