import { Component, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe, NgIf } from '@angular/common';
@Component({
  selector: 'app-payload',
  imports: [DecimalPipe, NgIf],
  templateUrl: './payload.html',
  styleUrl: './payload.scss',
})
export class Payload {
  cart = signal([
    {
      id: 1,
      name: "L'Oréal Paris Excellence Creme - Nâu Khói",
      brand: "L'Oréal Paris",
      price: 189000,
      qty: 1,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      name: "Dầu Gội Tím Khử Vàng Elvive Color Vibrancy",
      brand: "Elvive",
      price: 175000,
      qty: 1,
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      name: "Tinh Dầu Dưỡng Tóc Moroccanoil Treatment",
      brand: "Moroccanoil",
      price: 890000,
      qty: 1,
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=200&q=80"
    }
  ]);

  paymentMethods = [
    { id: 'cod', name: 'Tiền mặt khi nhận hàng (COD)', desc: 'Thanh toán an toàn khi nhận được hàng', icon: '💵' },
    { id: 'vnpay', name: 'Ví VNPay / Ngân hàng', desc: 'Giảm thêm 10k khi thanh toán qua QR Code', icon: '💳' },
    { id: 'momo', name: 'Ví MoMo', desc: 'Thanh toán nhanh gọn qua ứng dụng MoMo', icon: '💓' }
  ];

  selectedMethod = signal('cod');

  subtotal = computed(() => this.cart().reduce((sum, item) => sum + (item.price * item.qty), 0));
  shippingFee = computed(() => this.subtotal() >= 300000 ? 0 : 30000);

  // Method to navigate home
  goHome() {
    // In a real app, this would use Router.navigate(['/']);
    window.location.href = '/';
  }
}