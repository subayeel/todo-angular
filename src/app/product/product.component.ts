import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:5000/products';
  ngOnInit(): void {
    // Fetch the products from the server on component initialization
    this.fetchProducts();
  }

  title = 'subayeel';
  showModal = false;
  showEditModal = false;
  currentId = 0;

  fetchProducts(): void {
    // Make a GET request to retrieve all products from the server
    this.http.get<any[]>(this.apiUrl).subscribe(
      (response) => {
        this.products = response;
      },
      (error) => {
        console.error('Failed to fetch products', error);
      }
    );
  }
  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
  openEditModal(data: any): void {
    this.showEditModal = true;
    this.currentId = data._id;
    this.productName = data.name;
    this.price = data.price;
    this.category = data.category;
    this.color = data.color;
    this.inStock = data.inStock;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.clearAddForm();
  }

  clearAddForm(): void {
    this.productName = '';
    this.price = 0;
    this.category = '';
    this.color = '';
    this.inStock = true;
  }
  productName: string = '';
  price: number = 0;
  category: string = '';
  color: string = '';
  inStock: boolean = true;
  products = [
    {
      _id: 1,
      name: 'Product A',
      price: 10.99,
      category: 'Electronics',
      color: 'Black',
      inStock: true,
    },
    {
      _id: 2,
      name: 'Product B',
      price: 24.99,
      category: 'Clothing',
      color: 'Blue',
      inStock: false,
    },
    {
      _id: 3,
      name: 'Product C',
      price: 7.5,
      category: 'Home',
      color: 'Red',
      inStock: true,
    },
    // Add more products as needed
  ];
  handleFormSubmit(e: any) {
    // this.products.push({
    //   id: this.products.slice(-1)[0].id + 1,
    //   name: this.productName,
    //   price: this.price,
    //   category: this.category,
    //   color: this.color,
    //   inStock: this.inStock,
    // });

    this.http
      .post<any>(this.apiUrl, {
        name: this.productName,
        price: this.price,
        category: this.category,
        color: this.color,
        inStock: this.inStock,
      })
      .subscribe(
        (response) => {
          this.products.push(response);
          this.closeModal();
          this.clearAddForm();
        },
        (error) => {
          console.error('Failed to create product', error);
        }
      );
    // this.closeModal();
    // this.clearAddForm();
  }

  // handleProductUpdate(): any {
  //   let index = this.products.findIndex((obj) => obj.id === this.currentId);
  //   console.log(this.currentId);

  //   this.products[index].name = this.productName;
  //   this.products[index].price = this.price;
  //   this.products[index].category = this.category;
  //   this.products[index].color = this.color;
  //   this.products[index].inStock = this.inStock;

  //   this.closeEditModal();
  //   this.clearAddForm();
  // }

  // deleteProduct(prod: any): void {
  //   let index = this.products.indexOf(prod);
  //   this.products.splice(index, 1);
  // }
  handleProductUpdate(): void {
    // Make a PUT request to update a product
    const url = `${this.apiUrl}/${this.currentId}`;
    this.http
      .put<any>(url, {
        name: this.productName,
        price: this.price,
        category: this.category,
        color: this.color,
        inStock: this.inStock,
      })
      .subscribe(
        (response) => {
          // Find the updated product in the array and replace it
          const updatedProductIndex = this.products.findIndex(
            (product) => product._id === response._id
          );
          if (updatedProductIndex !== -1) {
            this.products[updatedProductIndex] = response;
          }
          this.closeEditModal();
          this.clearAddForm();
        },
        (error) => {
          console.error('Failed to update product', error);
        }
      );
  }

  deleteProduct(product: any): void {
    // Make a DELETE request to delete a product
    const url = `${this.apiUrl}/${product._id}`;
    this.http.delete<any>(url).subscribe(
      (response) => {
        // Remove the deleted product from the array
        const deletedProductIndex = this.products.findIndex(
          (p) => p._id === product._id
        );
        if (deletedProductIndex !== -1) {
          this.products.splice(deletedProductIndex, 1);
        }
      },
      (error) => {
        console.error('Failed to delete product', error);
      }
    );
  }
}
