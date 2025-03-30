export interface BusinessAnalytics {
  id: string;
  businessId: string;
  totalAppointments: number;
  completedAppointments: number;
  missedAppointments: number;
  totalRevenue: string;
  peakHours: PeakHour[];
  createdAt: string;
  updatedAt: string;
}

export interface PeakHour {
  day: string;
  time: string;
  count: number;
}

export interface Business {
  id: string;
  managerId: string;
  image: string | null;
  name: string;
  description: string;
  category: string;
  location: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  avg_rating: string;
}

export interface Interval {
  id: string;
  description: string;
  startTime: string;
  endTime: string;
  price: string | number;
  maxSlots: number;
  availableSlots: number;
}

export interface OrderMeta {
  notify_url: string | null;
  return_url: string;
  payment_methods: any | null;
}

export interface CustomerDetails {
  customer_id: string;
  customer_uid: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

export interface OrderResponse {
  entity: string;
  order_id: string;
  created_at: string;
  order_meta: OrderMeta;
  order_note: string | null;
  order_tags: string | null;
  cf_order_id: string;
  cart_details: any | null;
  order_amount: number;
  order_splits: any[];
  order_status: string;
  terminal_data: any | null;
  order_currency: string;
  customer_details: CustomerDetails;
  order_expiry_time: string;
  payment_session_id: string;
}

export interface Order {
  success: boolean;
  response: OrderResponse;
}

export interface Payment {
  id: string;
  userId: string;
  appointmentId: string;
  amount: string;
  status: string;
  order: Order;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  businessId: string;
  intervalId: string;
  status: string;
  startTime: string;
  endTime: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  Payment: Payment;
}

export type State = {
  global: {
    errMsg: string;
    showErr: boolean;
    Msg: string;
    showAlert: boolean;
  };
  ui: {
    open_sidebar: boolean;
    otp_form: boolean;
  };
  slot: {
    slots: Interval[];
  };
  business: {
    businessList: [];
    searchValue: string;
    search: boolean;
    aiSearch: boolean;
  };
};
