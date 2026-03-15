import { Component, signal, computed, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [DecimalPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit, OnDestroy {
  @ViewChild('articleSliderDiv') articleSliderEl!: ElementRef;
  private autoScrollInterval: any;

  // State
  cartItems = signal<any[]>([]);
  isCartOpen = signal(false);
  showToast = signal(false);

  // Auth State
  isAuthModalOpen = signal(false);
  isLoginView = signal(true);

  // Computed
  cartCount = computed(() => this.cartItems().reduce((total, item) => total + item.quantity, 0));
  cartTotal = computed(() => this.cartItems().reduce((total, item) => total + (item.price * item.quantity), 0));

  // Data
  categories = signal([
    { id: 1, name: 'Nhuộm Thời Trang', image: 'data:image/jpeg;base64,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' },
    { id: 2, name: 'Nhuộm Phủ Bạc', image: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { id: 3, name: 'Dưỡng Màu', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { id: 4, name: 'Tẩy Tóc', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { id: 5, name: 'Phục Hồi', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { id: 6, name: 'Dụng Cụ', image: 'data:image/jpeg;base64,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' },
  ]);

  productGroups = signal([
    {
      id: 'thuoc-nhuom',
      name: 'Thuốc Nhuộm Bán Chạy',
      products: [
        {
          id: 1, name: 'L\'Oréal Paris Excellence Creme - Phủ Bạc', brand: 'Thuốc nhuộm tóc', price: 189000,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', shopeeLink: 'https://shopee.vn/search?keyword=loreal',
          discountMsg: 'Mua 2 giảm 10% - Tặng kèm bộ dụng cụ nhuộm'
        },
        {
          id: 2, name: 'Mise En Scene Hello Bubble - Nâu Khói', brand: 'Thuốc nhuộm dạng bọt', price: 155000,
          image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', shopeeLink: 'https://shopee.vn/search?keyword=mise',
          discountMsg: 'Hoàn tiền 10% tối đa 50k khi thanh toán VNPay'
        },
        {
          id: 3, name: 'Bigen Silk Touch - Dành cho tóc yếu', brand: 'Thuốc nhuộm thảo dược', price: 210000,
          image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', shopeeLink: 'https://shopee.vn/search?keyword=bigen'
        },
        {
          id: 4, name: 'Garnier Nutrisse Nourishing Color Creme', brand: 'Thuốc nhuộm dưỡng tóc', price: 245000,
          image: 'https://images.unsplash.com/photo-1617897903246-719242758050?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', shopeeLink: 'https://shopee.vn/search?keyword=garnier'
        },
        {
          id: 7, name: '3CE Treatment Hair Tint', brand: 'Thuốc nhuộm tạm thời', price: 120000,
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', shopeeLink: 'https://shopee.vn/search?keyword=3ce'
        },
        {
          id: 8, name: 'Goldwell Topchic Vĩnh Viễn', brand: 'Thuốc nhuộm Salon', price: 350000,
          image: 'https://images.unsplash.com/photo-1571781526291-c477eb311dc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', shopeeLink: 'https://shopee.vn/search?keyword=goldwell'
        }
      ]
    },
    {
      id: 'cham-soc',
      name: 'Phục Hồi & Chăm Sóc',
      products: [
        {
          id: 5, name: 'Mặt Nạ Ủ Tóc Fino Premium Touch', brand: 'Kem ủ tóc', price: 169000,
          image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', shopeeLink: 'https://shopee.vn/search?keyword=fino'
        },
        {
          id: 6, name: 'Dầu Gội Tím Khử Vàng Elvive Color Vibrancy', brand: 'Dầu gội chuyên dụng', price: 175000,
          image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', shopeeLink: 'https://shopee.vn/search?keyword=elvive'
        },
        {
          id: 9, name: 'Tinh Dầu Dưỡng Tóc Moroccanoil Treatment', brand: 'Dầu dưỡng tóc', price: 890000,
          image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', shopeeLink: 'https://shopee.vn/search?keyword=moroccanoil'
        },
        {
          id: 10, name: 'Kem Xả Khô Olaplex No.6 Bond Smoother', brand: 'Kem xả khô', price: 750000,
          image: 'https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', shopeeLink: 'https://shopee.vn/search?keyword=olaplex'
        },
        {
          id: 11, name: 'Xịt Dưỡng Ẩm Tóc Tsubaki Premium', brand: 'Xịt dưỡng tóc', price: 155000,
          image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', shopeeLink: 'https://shopee.vn/search?keyword=tsubaki'
        },
        {
          id: 12, name: 'Serum Dưỡng Tóc Mise En Scene Perfect', brand: 'Serum vuốt tóc', price: 180000,
          image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', shopeeLink: 'https://shopee.vn/search?keyword=mise'
        }
      ]
    }
  ]);

  articles = signal([
    {
      id: 1,
      title: 'Top 5 Màu Tóc Nhuộm "Làm Mưa Làm Gió" Mùa Xuân Hè 2026',
      summary: 'Khám phá ngay những tone màu khói, nâu trà sữa và pastel đang dẫn đầu xu hướng năm nay giúp tôn da cực đỉnh.',
      category: 'Xu hướng',
      date: '10 Tháng 3, 2026',
      image: 'https://js0fpsb45jobj.vcdn.cloud/storage/upload/media/mau-toc-cho-da-ngam/mau-toc-lam-sang-da-ngam.jpg',
      url: 'https://webgiare.cloud/'
    },
    {
      id: 2,
      title: 'Bí Quyết Nhuộm Tóc Tại Nhà Lên Màu Chuẩn Như Salon',
      summary: 'Chia sẻ các bước chuẩn bị, cách pha thuốc và kỹ thuật chải thuốc đều tay để có mái tóc hoàn hảo không bị loang lổ.',
      category: 'Cẩm nang',
      date: '05 Tháng 3, 2026',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      url: 'https://vzone.vn/bi-quyet-nhuom-toc-tai-nha'
    },
    {
      id: 3,
      title: 'Cách Chăm Sóc Tóc Tẩy Để Màu Bền Lâu và Không Gãy Rụng',
      summary: 'Sử dụng dầu gội tím, mặt nạ phục hồi chuyên sâu và các quy tắc vàng cần nhớ nếu bạn đam mê những màu tóc sáng.',
      category: 'Chăm sóc tóc',
      date: '28 Tháng 2, 2026',
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      url: 'https://vzone.vn/cham-soc-toc-tay'
    },
    {
      id: 4,
      title: 'Gợi Ý 10 Kiểu Tóc Phù Hợp Giúp Khuôn Mặt Trở Nên Thon Gọn Hơn',
      summary: 'Biến hóa diện mạo ngay lập tức với những mẹo tạo kiểu và cắt tóc tỉa layer thần thánh giúp che đi khuyết điểm tự nhiên.',
      category: 'Phong cách',
      date: '20 Tháng 2, 2026',
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      url: 'https://vzone.vn/kieu-toc-cho-mat-tron'
    },
    {
      id: 5,
      title: 'Hiểu Đúng Về Các Loại Thuốc Nhuộm Tóc Tạm Thời Và Vĩnh Viễn',
      summary: 'Nên chọn loại thuốc nhuộm nào để vừa có màu ưng ý, vừa ít gây tổn thương nhất cho cấu trúc cốt lõi của sợi tóc?',
      category: 'Kiến thức',
      date: '15 Tháng 2, 2026',
      image: 'https://images.unsplash.com/photo-1600932684841-f519598b92d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      url: 'https://vzone.vn/phan-biet-thuoc-nhuom-toc'
    }
  ]);

  ngAfterViewInit() {
    this.autoScrollInterval = setInterval(() => {
      if (this.articleSliderEl && this.articleSliderEl.nativeElement) {
        const slider = this.articleSliderEl.nativeElement;
        if (Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth) {
          slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          this.scrollSlider(slider, 1);
        }
      }
    }, 4000);
  }

  ngOnDestroy() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  scrollSlider(slider: HTMLElement | any, direction: number) {
    const el = slider instanceof ElementRef ? slider.nativeElement : slider;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }

  calculateDiscount(price: number, oldPrice: number): number {
    if (!oldPrice || oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }

  addToCart(product: any) {
    this.cartItems.update(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { ...product, quantity: 1 }];
    });

    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }

  toggleCart() {
    this.isCartOpen.set(!this.isCartOpen());
  }

  toggleAuthModal() {
    this.isAuthModalOpen.set(!this.isAuthModalOpen());
    if (this.isAuthModalOpen()) {
      this.isLoginView.set(true); // Đặt mặc định về đăng nhập khi mở
    }
  }

  switchAuthView() {
    this.isLoginView.set(!this.isLoginView());
  }

  submitAuth(event: Event) {
    event.preventDefault();
    alert(this.isLoginView() ? 'Đăng nhập thành công!' : 'Đăng ký thành công!');
    this.isAuthModalOpen.set(false);
  }

  removeItem(productId: number) {
    this.cartItems.update(items => items.filter(i => i.id !== productId));
  }

  updateQuantity(productId: number, delta: number) {
    this.cartItems.update(items => items.map(i => {
      if (i.id === productId) {
        const newQ = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQ };
      }
      return i;
    }));
  }

  handleImageError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  }

  go_pay() {
    window.location.href = '/payload';
  }
}