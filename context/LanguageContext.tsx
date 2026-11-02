'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr' | 'am' | 'ar';

export interface Translations {
  // Navigation & General
  platformTitle: string;
  platformSubtitle: string;
  nigtFleet: string;
  autoStore: string;
  about: string;
  features: string;
  contact: string;
  login: string;
  register: string;
  dashboard: string;
  openStore: string;
  currency: string;
  actions: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  loading: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  getStarted: string;
  accessPortal: string;
  safe: string;
  efficient: string;
  connected: string;
  reliable: string;
  slide1Caption: string;
  slide1Sub: string;
  slide2Caption: string;
  slide2Sub: string;
  slide3Caption: string;
  slide3Sub: string;
  slide4Caption: string;
  slide4Sub: string;

  // Features Section
  whyNigt: string;
  featuresHeadline: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;

  // Marketplace Section
  marketplaceBadge: string;
  storeHeadline: string;
  storeSubheadline: string;
  visitFullStore: string;
  fastFleetDispatch: string;
  fastFleetDispatchDesc: string;
  browseFullCatalog: string;

  // Demo showcase products fallback
  showcaseTireName: string;
  showcaseTireDesc: string;
  showcaseOilName: string;
  showcaseOilDesc: string;
  showcaseBatteryName: string;
  showcaseBatteryDesc: string;
  showcaseFilterName: string;
  showcaseFilterDesc: string;

  // Category translations
  categoryTires: string;
  categoryOil: string;
  categoryElectrical: string;
  categoryFilters: string;
  categoryAccessories: string;
  translateCategoryName: (name: string) => string;

  // User Roles Section
  platformUsers: string;
  whoIsThisFor: string;
  vehicleOwnersTitle: string;
  vehicleOwnersDesc: string;
  driversTitle: string;
  driversDesc: string;
  joinAsOwner: string;
  joinAsDriver: string;

  // Footer
  movingTogether: string;
  quickLinks: string;
  allRightsReserved: string;
  whatsAppSupport: string;

  // Sidebar Nav Items
  navDashboard: string;
  navUsers: string;
  navVehicles: string;
  navJobs: string;
  navTrips: string;
  navProfileRequests: string;
  navShopOverview: string;
  navProducts: string;
  navCategories: string;
  navShopOrders: string;
  navMyVehicles: string;
  navMyAssignment: string;
  navMyTrips: string;
  navAutoStore: string;
  navMyCart: string;
  navMyOrders: string;
  navProfile: string;
  navSignOut: string;
  navSignIn: string;
  navHome: string;
  navLoginToOrder: string;

  // Store & Catalog
  storeTitle: string;
  storeSubtitle: string;
  searchPlaceholder: string;
  searchButton: string;
  allCategories: string;
  cart: string;
  price: string;
  inStock: string;
  leftInStock: string;
  soldOut: string;
  outOfStock: string;
  addToCart: string;
  addedToCart: string;
  viewDetails: string;
  orderNow: string;
  noProductsFound: string;
  noProductsDesc: string;

  // Product Details
  backToStore: string;
  productDescription: string;
  quantity: string;
  viewCart: string;
  skuLabel: string;
  maxStockLimit: string;

  // Cart & Checkout
  shoppingCart: string;
  cartEmpty: string;
  cartEmptyDesc: string;
  browseStore: string;
  orderSummary: string;
  checkout: string;
  checkoutTitle: string;
  completeOrder: string;
  deliveryDetails: string;
  total: string;
  subtotal: string;
  itemSingular: string;
  itemPlural: string;
  shippingAddress: string;
  shippingAddressPlaceholder: string;
  shippingAddressRequired: string;
  specialInstructions: string;
  specialInstructionsPlaceholder: string;
  placeOrder: string;
  placingOrder: string;
  continueShopping: string;
  shopMore: string;
  orderItems: string;
  orderSuccess: string;

  // Orders Page
  myOrders: string;
  orderHistory: string;
  orderHistoryDesc: string;
  noOrdersYet: string;
  noOrdersDesc: string;
  deliveryAddress: string;
  orderNotes: string;
  orderTotal: string;
  orderDate: string;
  statusPending: string;
  statusConfirmed: string;
  statusProcessing: string;
  statusShipped: string;
  statusDelivered: string;
  statusCancelled: string;
  descPending: string;
  descConfirmed: string;
  descProcessing: string;
  descShipped: string;
  descDelivered: string;
  descCancelled: string;
  translateStatus: (status: string) => { label: string; desc: string };

  // Auth pages (Login & Register)
  loginTitle: string;
  loginSubtitle: string;
  emailOrPhone: string;
  emailOrPhonePlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  forgotPassword: string;
  signInBtn: string;
  noAccount: string;
  createOne: string;
  backToHome: string;
  registerTitle: string;
  registerSubtitle: string;
  asVehicleOwner: string;
  asOwnerDesc: string;
  asDriver: string;
  asDriverDesc: string;
  alreadyHaveAccount: string;
  loginHere: string;

  // Admin Shop
  adminShopTitle: string;
  adminShopSubtitle: string;
  totalRevenue: string;
  totalOrders: string;
  totalProductsCount: string;
  lowStockAlert: string;
  manageProducts: string;
  manageCategories: string;
  viewAllOrders: string;
  addProduct: string;
  addCategory: string;
  productName: string;
  category: string;
  stock: string;

  // WhatsApp
  askOnWhatsApp: string;
  buyViaWhatsApp: string;
  chatWithSupport: string;
  whatsAppInquiryMsg: (productName: string, price: number, sku?: string) => string;
  whatsAppGeneralMsg: string;
}

const createCategoryTranslator = (map: Record<string, string>) => (name: string) => {
  if (!name) return name;
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key.toLowerCase())) return val;
  }
  return name;
};

const createStatusTranslator = (
  labels: Record<string, string>,
  descriptions: Record<string, string>
) => (status: string) => ({
  label: labels[status] || status,
  desc: descriptions[status] || '',
});

export const translations: Record<Language, Translations> = {
  en: {
    platformTitle: 'NIGT Platform',
    platformSubtitle: 'Transportation Operations Management',
    nigtFleet: 'NIGT Fleet',
    autoStore: 'Auto Store',
    about: 'About',
    features: 'Features',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    openStore: 'Open Store',
    currency: 'ETB',
    actions: 'Actions',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    loading: 'Loading...',

    heroTitle: 'Smarter Transportation',
    heroSubtitle: 'Operations',
    heroDescription:
      'A centralized platform for managing NIGT transportation operations, drivers, vehicles, and activities — all in one place.',
    getStarted: 'Get Started',
    accessPortal: 'Access Portal',
    safe: 'Safe',
    efficient: 'Efficient',
    connected: 'Connected',
    reliable: 'Reliable',
    slide1Caption: 'On the Road, Every Day',
    slide1Sub: 'Powering long-haul transportation across the country.',
    slide2Caption: 'Fleet Management at Scale',
    slide2Sub: 'Centrally manage hundreds of vehicles with ease.',
    slide3Caption: 'Trusted Drivers, Verified',
    slide3Sub: 'Every driver on the platform is screened and approved.',
    slide4Caption: 'NIGT Transportation',
    slide4Sub: 'Moving Together. Delivering Excellence.',

    whyNigt: 'Why NIGT?',
    featuresHeadline: 'Built for Transportation Excellence',
    feature1Title: 'Safe & Secure',
    feature1Desc: 'Strict verification for all drivers and vehicles ensures maximum safety on every trip.',
    feature2Title: 'Connected Logistics',
    feature2Desc: 'Real-time tracking and trip monitoring keeps operations smooth and predictable.',
    feature3Title: 'Efficient Reporting',
    feature3Desc: 'Comprehensive dashboards and analytics for vehicle owners and administrators.',

    marketplaceBadge: 'Fleet Marketplace',
    storeHeadline: 'Automotive Parts & Accessories',
    storeSubheadline:
      'Certified tires, heavy-duty engine oil, filters, and batteries for your fleet — managed and dispatched directly by NIGT.',
    visitFullStore: 'Visit Full Store',
    fastFleetDispatch: 'Fast Fleet Dispatch & Direct Delivery',
    fastFleetDispatchDesc:
      'Order replacement parts, heavy-duty tires, or engine oil through the portal and have them dispatched directly using NIGT’s fleet network.',
    browseFullCatalog: 'Browse Full Catalog',

    showcaseTireName: 'Bridgestone Heavy Duty Truck Tire 295/80R22.5',
    showcaseTireDesc: 'All-position radial tire built for long-haul fleet performance, high durability, and retreadability.',
    showcaseOilName: 'TotalEnergies Rubia Fleet HD Engine Oil 15W-40 (20L)',
    showcaseOilDesc: 'High-performance mineral lubricant designed for commercial diesel truck engines.',
    showcaseBatteryName: 'Bosch Commercial Fleet Heavy Duty Battery 12V 200Ah',
    showcaseBatteryDesc: 'Vibration-resistant heavy-duty power battery for commercial transport vehicles.',
    showcaseFilterName: 'Fleetguard Heavy Duty Spin-on Oil & Fuel Filter Set',
    showcaseFilterDesc: 'Maximum filtration efficiency protecting high-pressure common-rail fuel systems.',

    categoryTires: 'Tires & Wheels',
    categoryOil: 'Engine Oil & Lubricants',
    categoryElectrical: 'Electrical & Batteries',
    categoryFilters: 'Filters & Maintenance',
    categoryAccessories: 'Vehicle Accessories',
    translateCategoryName: createCategoryTranslator({
      tire: 'Tires & Wheels',
      oil: 'Engine Oil & Lubricants',
      lubricant: 'Engine Oil & Lubricants',
      battery: 'Electrical & Batteries',
      electric: 'Electrical & Batteries',
      filter: 'Filters & Maintenance',
      access: 'Vehicle Accessories',
    }),

    platformUsers: 'Platform Users',
    whoIsThisFor: 'Who is this for?',
    vehicleOwnersTitle: 'Vehicle Owners',
    vehicleOwnersDesc:
      'Register your fleet, assign certified drivers, and track your vehicles and operations from a single dashboard.',
    driversTitle: 'Professional Drivers',
    driversDesc:
      'Manage assigned trips, view your vehicle assignments, and stay connected with your fleet owner in real-time.',
    joinAsOwner: 'Join as Vehicle Owner',
    joinAsDriver: 'Join as Professional Driver',

    movingTogether: 'Moving together. Delivering excellence.',
    quickLinks: 'Quick Links',
    allRightsReserved: 'NIGT Transportation Operations Management. All rights reserved.',
    whatsAppSupport: 'WhatsApp Support',

    navDashboard: 'Dashboard',
    navUsers: 'Users',
    navVehicles: 'Vehicles',
    navJobs: 'Jobs',
    navTrips: 'Trips',
    navProfileRequests: 'Profile Requests',
    navShopOverview: 'Shop Overview',
    navProducts: 'Products',
    navCategories: 'Categories',
    navShopOrders: 'Shop Orders',
    navMyVehicles: 'My Vehicles',
    navMyAssignment: 'My Assignment',
    navMyTrips: 'My Trips',
    navAutoStore: 'Auto Store',
    navMyCart: 'My Cart',
    navMyOrders: 'My Orders',
    navProfile: 'Profile',
    navSignOut: 'Sign Out',
    navSignIn: 'Sign In',
    navHome: 'Home Page',
    navLoginToOrder: 'Login to Order',

    storeTitle: 'Automotive Parts Store',
    storeSubtitle: 'Certified tires, lubricants, batteries, and accessories for your fleet',
    searchPlaceholder: 'Search tires, engine oil, filters, batteries...',
    searchButton: 'Search',
    allCategories: 'All Categories',
    cart: 'Cart',
    price: 'Price',
    inStock: 'In Stock',
    leftInStock: 'left in stock',
    soldOut: 'SOLD OUT',
    outOfStock: 'Out of Stock',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart ✓',
    viewDetails: 'View Details',
    orderNow: 'Order Now',
    noProductsFound: 'No products found',
    noProductsDesc: 'Try adjusting your search or category filter.',

    backToStore: 'Back to Store',
    productDescription: 'Description',
    quantity: 'Quantity',
    viewCart: 'View Cart',
    skuLabel: 'SKU',
    maxStockLimit: 'max',

    shoppingCart: 'Shopping Cart',
    cartEmpty: 'Your cart is empty',
    cartEmptyDesc: 'Browse the store and add parts to your cart',
    browseStore: 'Browse Store',
    orderSummary: 'Order Summary',
    checkout: 'Checkout',
    checkoutTitle: 'Checkout',
    completeOrder: 'Complete your parts order',
    deliveryDetails: 'Delivery Details',
    total: 'Total',
    subtotal: 'Subtotal',
    itemSingular: 'item',
    itemPlural: 'items',
    shippingAddress: 'Shipping / Delivery Address',
    shippingAddressPlaceholder: 'Enter your destination terminal, city, or street address',
    shippingAddressRequired: 'Please enter a shipping address.',
    specialInstructions: 'Delivery Instructions (optional)',
    specialInstructionsPlaceholder: 'e.g. Call before delivery, gate code, contact person',
    placeOrder: 'Place Order',
    placingOrder: 'Placing Order...',
    continueShopping: '← Continue Shopping',
    shopMore: '← Shop More',
    orderItems: 'Order Items',
    orderSuccess: 'Order placed successfully! Redirecting...',

    myOrders: 'My Orders',
    orderHistory: 'Order History',
    orderHistoryDesc: 'Track your fleet parts and accessories orders',
    noOrdersYet: 'No orders yet',
    noOrdersDesc: 'Browse the store and place your first order',
    deliveryAddress: 'Delivery Address',
    orderNotes: 'Notes',
    orderTotal: 'Order Total',
    orderDate: 'Order Date',
    statusPending: 'PENDING',
    statusConfirmed: 'CONFIRMED',
    statusProcessing: 'PROCESSING',
    statusShipped: 'SHIPPED',
    statusDelivered: 'DELIVERED',
    statusCancelled: 'CANCELLED',
    descPending: 'Order received, awaiting confirmation',
    descConfirmed: 'Order confirmed by the store',
    descProcessing: 'Preparing your items for dispatch',
    descShipped: 'On its way to your destination',
    descDelivered: 'Delivered successfully',
    descCancelled: 'Order was cancelled',
    translateStatus: createStatusTranslator(
      {
        PENDING: 'PENDING',
        CONFIRMED: 'CONFIRMED',
        PROCESSING: 'PROCESSING',
        SHIPPED: 'SHIPPED',
        DELIVERED: 'DELIVERED',
        CANCELLED: 'CANCELLED',
      },
      {
        PENDING: 'Order received, awaiting confirmation',
        CONFIRMED: 'Order confirmed by the store',
        PROCESSING: 'Preparing your items for dispatch',
        SHIPPED: 'On its way to your destination',
        DELIVERED: 'Delivered successfully',
        CANCELLED: 'Order was cancelled',
      }
    ),

    loginTitle: 'Access Portal',
    loginSubtitle: 'Sign in to manage your account and fleet operations',
    emailOrPhone: 'Email or Phone Number',
    emailOrPhonePlaceholder: 'john@example.com or +251...',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    forgotPassword: 'Forgot password?',
    signInBtn: 'Sign In',
    noAccount: "Don't have an account?",
    createOne: 'Create one now',
    backToHome: 'Back to Home',
    registerTitle: 'Join NIGT Platform',
    registerSubtitle: 'How would you like to register today?',
    asVehicleOwner: 'Vehicle Owner',
    asOwnerDesc: 'Register your fleet, assign drivers, and track your vehicle earnings.',
    asDriver: 'Professional Driver',
    asDriverDesc: 'Manage your trips, report delivery statuses, and stay connected.',
    alreadyHaveAccount: 'Already have an account?',
    loginHere: 'Log in here',

    adminShopTitle: 'Shop Management',
    adminShopSubtitle: 'Manage inventory, categories, products, and customer orders',
    totalRevenue: 'Total Revenue',
    totalOrders: 'Total Orders',
    totalProductsCount: 'Total Products',
    lowStockAlert: 'Low Stock Alerts',
    manageProducts: 'Manage Products',
    manageCategories: 'Manage Categories',
    viewAllOrders: 'View All Orders',
    addProduct: 'Add New Product',
    addCategory: 'Add Category',
    productName: 'Product Name',
    category: 'Category',
    stock: 'Stock',

    askOnWhatsApp: 'Ask on WhatsApp',
    buyViaWhatsApp: 'Buy / Inquire via WhatsApp',
    chatWithSupport: 'Chat on WhatsApp',
    whatsAppInquiryMsg: (name, price, sku) =>
      `Hello NIGT! I am interested in buying: *${name}* (Price: ETB ${price.toLocaleString()}${sku ? `, SKU: ${sku}` : ''}). Is this currently available for delivery?`,
    whatsAppGeneralMsg:
      'Hello NIGT Team! I have a question regarding automotive parts and vehicle accessories.',
  },

  fr: {
    platformTitle: 'Plateforme NIGT',
    platformSubtitle: 'Gestion des Opérations de Transport',
    nigtFleet: 'Flotte NIGT',
    autoStore: 'Boutique Auto',
    about: 'À propos',
    features: 'Fonctionnalités',
    contact: 'Contact',
    login: 'Connexion',
    register: 'Inscription',
    dashboard: 'Tableau de bord',
    openStore: 'Ouvrir la Boutique',
    currency: 'ETB',
    actions: 'Actions',
    cancel: 'Annuler',
    save: 'Enregistrer',
    edit: 'Modifier',
    delete: 'Supprimer',
    loading: 'Chargement...',

    heroTitle: 'Opérations de Transport',
    heroSubtitle: 'Intelligentes',
    heroDescription:
      'Une plateforme centralisée pour gérer les opérations de transport NIGT, les chauffeurs, les véhicules et les activités — en un seul endroit.',
    getStarted: 'Commencer',
    accessPortal: 'Accéder au Portail',
    safe: 'Sécurisé',
    efficient: 'Efficace',
    connected: 'Connecté',
    reliable: 'Fiable',
    slide1Caption: 'Sur la Route, Chaque Jour',
    slide1Sub: 'Propulser le transport longue distance à travers le pays.',
    slide2Caption: 'Gestion de Flotte à Grande Échelle',
    slide2Sub: 'Gérez facilement des centaines de véhicules de façon centralisée.',
    slide3Caption: 'Chauffeurs de Confiance, Vérifiés',
    slide3Sub: 'Chaque conducteur sur la plateforme est contrôlé et certifié.',
    slide4Caption: 'Transport NIGT',
    slide4Sub: 'Avancer ensemble. Livrer l’excellence.',

    whyNigt: 'Pourquoi NIGT ?',
    featuresHeadline: 'Conçu pour l’Excellence du Transport',
    feature1Title: 'Sûr & Sécurisé',
    feature1Desc: 'Une vérification rigoureuse des chauffeurs et véhicules garantit une sécurité maximale à chaque voyage.',
    feature2Title: 'Logistique Connectée',
    feature2Desc: 'Le suivi en temps réel et la gestion des trajets assurent des opérations fluides et prévisibles.',
    feature3Title: 'Rapports Détaillés',
    feature3Desc: 'Des tableaux de bord complets et des analyses pour les propriétaires de véhicules et administrateurs.',

    marketplaceBadge: 'Marché de Flotte',
    storeHeadline: 'Pièces & Accessoires Automobiles',
    storeSubheadline:
      'Pneus certifiés, huile moteur haute performance, filtres et batteries pour votre flotte — gérés et expédiés directement par NIGT.',
    visitFullStore: 'Visiter la Boutique Complète',
    fastFleetDispatch: 'Expédition Rapide & Livraison Directe',
    fastFleetDispatchDesc:
      'Commandez des pièces de rechange, pneus poids lourds ou huile moteur via le portail avec livraison assurée par la flotte NIGT.',
    browseFullCatalog: 'Consulter Tout le Catalogue',

    showcaseTireName: 'Pneu Poids Lourd Bridgestone 295/80R22.5',
    showcaseTireDesc: 'Pneu radial toutes positions pour transport longue distance, haute longévité et rechapable.',
    showcaseOilName: 'Huile Moteur TotalEnergies Rubia Fleet HD 15W-40 (20L)',
    showcaseOilDesc: 'Lubrifiant minéral haute performance pour moteurs diesel de transport lourd.',
    showcaseBatteryName: 'Batterie Poids Lourd Bosch 12V 200Ah',
    showcaseBatteryDesc: 'Batterie haute résistance aux vibrations pour véhicules de transport commercial.',
    showcaseFilterName: 'Kit Filtres à Huile & Carburant Fleetguard',
    showcaseFilterDesc: 'Filtration maximale protégeant les systèmes d’injection à rampe commune.',

    categoryTires: 'Pneus & Roues',
    categoryOil: 'Huile Moteur & Lubrifiants',
    categoryElectrical: 'Électricité & Batteries',
    categoryFilters: 'Filtres & Entretien',
    categoryAccessories: 'Accessoires Véhicule',
    translateCategoryName: createCategoryTranslator({
      tire: 'Pneus & Roues',
      pneu: 'Pneus & Roues',
      oil: 'Huile Moteur & Lubrifiants',
      huile: 'Huile Moteur & Lubrifiants',
      lubricant: 'Huile Moteur & Lubrifiants',
      battery: 'Électricité & Batteries',
      batterie: 'Électricité & Batteries',
      electric: 'Électricité & Batteries',
      filter: 'Filtres & Entretien',
      filtre: 'Filtres & Entretien',
      access: 'Accessoires Véhicule',
    }),

    platformUsers: 'Utilisateurs de la Plateforme',
    whoIsThisFor: 'À qui s’adresse cette plateforme ?',
    vehicleOwnersTitle: 'Propriétaires de Véhicules',
    vehicleOwnersDesc:
      'Enregistrez votre flotte, affectez des chauffeurs certifiés et suivez vos véhicules depuis un tableau de bord unique.',
    driversTitle: 'Chauffeurs Professionnels',
    driversDesc:
      'Gérez vos trajets assignés, consultez vos affectations de véhicules et restez connecté avec votre propriétaire de flotte en temps réel.',
    joinAsOwner: 'Rejoindre comme Propriétaire',
    joinAsDriver: 'Rejoindre comme Chauffeur',

    movingTogether: 'Avancer ensemble. Livrer l’excellence.',
    quickLinks: 'Liens Rapides',
    allRightsReserved: 'NIGT Gestion des Opérations de Transport. Tous droits réservés.',
    whatsAppSupport: 'Support WhatsApp',

    navDashboard: 'Tableau de bord',
    navUsers: 'Utilisateurs',
    navVehicles: 'Véhicules',
    navJobs: 'Missions',
    navTrips: 'Trajets',
    navProfileRequests: 'Demandes de Profil',
    navShopOverview: 'Aperçu Boutique',
    navProducts: 'Produits',
    navCategories: 'Catégories',
    navShopOrders: 'Commandes Boutique',
    navMyVehicles: 'Mes Véhicules',
    navMyAssignment: 'Mon Affectation',
    navMyTrips: 'Mes Trajets',
    navAutoStore: 'Boutique Auto',
    navMyCart: 'Mon Panier',
    navMyOrders: 'Mes Commandes',
    navProfile: 'Mon Profil',
    navSignOut: 'Déconnexion',
    navSignIn: 'Connexion',
    navHome: 'Accueil',
    navLoginToOrder: 'Se connecter pour commander',

    storeTitle: 'Boutique de Pièces Automobiles',
    storeSubtitle: 'Pneus certifiés, lubrifiants, batteries et accessoires pour votre flotte',
    searchPlaceholder: 'Rechercher pneus, huile moteur, filtres, batteries...',
    searchButton: 'Rechercher',
    allCategories: 'Toutes les Catégories',
    cart: 'Panier',
    price: 'Prix',
    inStock: 'En Stock',
    leftInStock: 'restants en stock',
    soldOut: 'ÉPUISÉ',
    outOfStock: 'En rupture de stock',
    addToCart: 'Ajouter au Panier',
    addedToCart: 'Ajouté au Panier ✓',
    viewDetails: 'Voir Détails',
    orderNow: 'Commander',
    noProductsFound: 'Aucun produit trouvé',
    noProductsDesc: 'Essayez de modifier votre recherche ou le filtre de catégorie.',

    backToStore: 'Retour à la Boutique',
    productDescription: 'Description',
    quantity: 'Quantité',
    viewCart: 'Voir le Panier',
    skuLabel: 'Réf. SKU',
    maxStockLimit: 'max',

    shoppingCart: 'Panier d’Achat',
    cartEmpty: 'Votre panier est vide',
    cartEmptyDesc: 'Parcourez la boutique et ajoutez des pièces à votre panier',
    browseStore: 'Parcourir la Boutique',
    orderSummary: 'Récapitulatif de la Commande',
    checkout: 'Passer la Commande',
    checkoutTitle: 'Validation de Commande',
    completeOrder: 'Finalisez votre commande de pièces',
    deliveryDetails: 'Détails de Livraison',
    total: 'Total',
    subtotal: 'Sous-total',
    itemSingular: 'article',
    itemPlural: 'articles',
    shippingAddress: 'Adresse de Livraison',
    shippingAddressPlaceholder: 'Entrez l’adresse exacte ou le terminal de destination',
    shippingAddressRequired: 'Veuillez saisir une adresse de livraison.',
    specialInstructions: 'Instructions Spéciales (optionnel)',
    specialInstructionsPlaceholder: 'Ex: Appeler avant livraison, consignes au portail...',
    placeOrder: 'Confirmer la Commande',
    placingOrder: 'Confirmation en cours...',
    continueShopping: '← Continuer les Achats',
    shopMore: '← Découvrir d’autres pièces',
    orderItems: 'Articles Commandés',
    orderSuccess: 'Commande effectuée avec succès ! Redirection...',

    myOrders: 'Mes Commandes',
    orderHistory: 'Historique des Commandes',
    orderHistoryDesc: 'Suivez vos commandes de pièces et accessoires',
    noOrdersYet: 'Aucune commande pour le moment',
    noOrdersDesc: 'Parcourez la boutique pour passer votre première commande',
    deliveryAddress: 'Adresse de Livraison',
    orderNotes: 'Instructions / Notes',
    orderTotal: 'Total de la Commande',
    orderDate: 'Date de Commande',
    statusPending: 'EN ATTENTE',
    statusConfirmed: 'CONFIRMÉE',
    statusProcessing: 'EN PRÉPARATION',
    statusShipped: 'EXPÉDIÉE',
    statusDelivered: 'LIVRÉE',
    statusCancelled: 'ANNULÉE',
    descPending: 'Commande reçue, en attente de confirmation',
    descConfirmed: 'Commande confirmée par la boutique',
    descProcessing: 'Préparation de vos articles en cours',
    descShipped: 'En cours d’acheminement vers votre terminal',
    descDelivered: 'Livrée avec succès',
    descCancelled: 'Cette commande a été annulée',
    translateStatus: createStatusTranslator(
      {
        PENDING: 'EN ATTENTE',
        CONFIRMED: 'CONFIRMÉE',
        PROCESSING: 'EN PRÉPARATION',
        SHIPPED: 'EXPÉDIÉE',
        DELIVERED: 'LIVRÉE',
        CANCELLED: 'ANNULÉE',
      },
      {
        PENDING: 'Commande reçue, en attente de confirmation',
        CONFIRMED: 'Commande confirmée par la boutique',
        PROCESSING: 'Préparation de vos articles en cours',
        SHIPPED: 'En cours d’acheminement vers votre terminal',
        DELIVERED: 'Livrée avec succès',
        CANCELLED: 'Cette commande a été annulée',
      }
    ),

    loginTitle: 'Portail d’Accès',
    loginSubtitle: 'Connectez-vous pour gérer votre compte et votre flotte',
    emailOrPhone: 'E-mail ou Téléphone',
    emailOrPhonePlaceholder: 'nom@exemple.com ou +251...',
    password: 'Mot de passe',
    passwordPlaceholder: '••••••••',
    forgotPassword: 'Mot de passe oublié ?',
    signInBtn: 'Se Connecter',
    noAccount: 'Vous n’avez pas de compte ?',
    createOne: 'Créez-en un ici',
    backToHome: 'Retour à l’Accueil',
    registerTitle: 'Rejoindre la Plateforme NIGT',
    registerSubtitle: 'Comment souhaitez-vous vous inscrire aujourd’hui ?',
    asVehicleOwner: 'Propriétaire de Véhicule',
    asOwnerDesc: 'Enregistrez votre flotte, affectez des chauffeurs et suivez vos gains.',
    asDriver: 'Chauffeur Professionnel',
    asDriverDesc: 'Gérez vos trajets, signalez le statut de livraison et restez connecté.',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    loginHere: 'Connectez-vous ici',

    adminShopTitle: 'Gestion de la Boutique',
    adminShopSubtitle: 'Gérez le stock, les catégories, les produits et les commandes',
    totalRevenue: 'Chiffre d’Affaires Total',
    totalOrders: 'Total des Commandes',
    totalProductsCount: 'Nombre de Produits',
    lowStockAlert: 'Alerte Stock Faible',
    manageProducts: 'Gérer les Produits',
    manageCategories: 'Gérer les Catégories',
    viewAllOrders: 'Toutes les Commandes',
    addProduct: 'Ajouter un Produit',
    addCategory: 'Ajouter une Catégorie',
    productName: 'Nom du Produit',
    category: 'Catégorie',
    stock: 'Stock',

    askOnWhatsApp: 'Demander sur WhatsApp',
    buyViaWhatsApp: 'Acheter via WhatsApp',
    chatWithSupport: 'Discuter sur WhatsApp',
    whatsAppInquiryMsg: (name, price, sku) =>
      `Bonjour NIGT ! Je souhaite acheter : *${name}* (Prix : ETB ${price.toLocaleString()}${sku ? `, Réf : ${sku}` : ''}). Est-ce disponible pour livraison ?`,
    whatsAppGeneralMsg:
      'Bonjour l’équipe NIGT ! J’ai une question concernant les pièces détachées et accessoires pour véhicules.',
  },

  am: {
    platformTitle: 'ኒጅት ፕላትፎርም',
    platformSubtitle: 'የትራንስፖርት ስራዎች አስተዳደር',
    nigtFleet: 'የኒጅት መርከብ',
    autoStore: 'የመኪና እቃዎች መደብር',
    about: 'ስለ እኛ',
    features: 'አገልግሎቶች',
    contact: 'አግኙን',
    login: 'ግባ',
    register: 'ተመዝገብ',
    dashboard: 'ዳሽቦርድ',
    openStore: 'መደብር ክፈት',
    currency: 'ETB',
    actions: 'ተግባራት',
    cancel: 'ሰርዝ',
    save: 'አስቀምጥ',
    edit: 'አስተካክል',
    delete: 'አጥፋ',
    loading: 'በመጫን ላይ...',

    heroTitle: 'ዘመናዊ የትራንስፖርት',
    heroSubtitle: 'አሰራርና አስተዳደር',
    heroDescription:
      'የኒጅት ትራንስፖርት ስራዎችን፣ አሽከርካሪዎችን፣ ተሽከርካሪዎችን እና አጠቃላይ የስራ ሂደቶችን በአንድ ማዕከል የሚያስተዳድሩበት ዘመናዊ ፕላትፎርም።',
    getStarted: 'ጀምር',
    accessPortal: 'ወደ ፖርታል ግባ',
    safe: 'አስተማማኝ',
    efficient: 'ቀልጣፋ',
    connected: 'የተሳለጠ',
    reliable: 'ታማኝ',
    slide1Caption: 'ሁልጊዜ በመንገድ ላይ',
    slide1Sub: 'አገር አቀፍ የረጅም ርቀት የትራንስፖርት አገልግሎት በማቅረብ ላይ።',
    slide2Caption: 'ትልቅ የትራንስፖርት መርከብ አስተዳደር',
    slide2Sub: 'በመቶዎች የሚቆጠሩ ተሽከርካሪዎችን በቀላሉ በአንድ ቦታ ያስተዳድሩ።',
    slide3Caption: 'ብቁና የተረጋገጡ አሽከርካሪዎች',
    slide3Sub: 'በፕላትፎርሙ ላይ ያለ እያንዳንዱ አሽከርካሪ ተገምግሞ የጸደቀ ነው።',
    slide4Caption: 'የኒጅት ትራንስፖርት',
    slide4Sub: 'አብረን ወደፊት። የላቀ አገልግሎት በማቅረብ ላይ።',

    whyNigt: 'ለምን ኒጅት?',
    featuresHeadline: 'ለትራንስፖርት የላቀ ስራ የተገነባ',
    feature1Title: 'ደህንነቱ የተጠበቀ',
    feature1Desc: 'የአሽከርካሪዎች እና የተሽከርካሪዎች ጥብቅ ማረጋገጫ በጉዞዎ ሙሉ ደህንነት ይሰጣል።',
    feature2Title: 'የተሳለጠ ሎጅስቲክስ',
    feature2Desc: 'የቀጥታ ጉዞ ክትትል ስራዎችን ቀልጣፋ እና አስተማማኝ ያደርጋል።',
    feature3Title: 'ትክክለኛ ሪፖርቶች',
    feature3Desc: 'ለተሽከርካሪ ባለቤቶች እና አስተዳዳሪዎች ዝርዝር ዳሽቦርድ እና የትንታኔ መረጃዎች።',

    marketplaceBadge: 'የተሽከርካሪ እቃዎች መደብር',
    storeHeadline: 'የመኪና መለዋወጫ እቃዎችና መገልገያዎች',
    storeSubheadline:
      'ጥራት ያላቸው ጎማዎች፣ ዘይቶች፣ ማጣሪያዎች እና ባትሪዎች ለተሽከርካሪዎ — በቀጥታ በኒጅት የሚቀርብ።',
    visitFullStore: 'ሙሉ መደብሩን ጎብኝ',
    fastFleetDispatch: 'ፈጣን ጭነትና የቀጥታ አቅርቦት',
    fastFleetDispatchDesc:
      'የጎማ፣ የሞተር ዘይት ወይም መለዋወጫ እቃዎችን በቀጥታ በፖርታሉ ይዘዙና በኒጅት ትራንስፖርት አውታር ይቀበሉ።',
    browseFullCatalog: 'ሁሉንም እቃዎች ተመልከት',

    showcaseTireName: 'ብሪጅስቶን ከባድ የጭነት መኪና ጎማ 295/80R22.5',
    showcaseTireDesc: 'ለረጅም ርቀት ጉዞ የተሰራ ጠንካራ እና አስተማማኝ ራዲያል ጎማ።',
    showcaseOilName: 'ቶታል ኢነርጂ ሩቢያ ፍሊት ኤችዲ የሞተር ዘይት 15W-40 (20L)',
    showcaseOilDesc: 'ለከባድ የናፍጣ ሞተሮች የተዘጋጀ ከፍተኛ ጥራት ያለው የሞተር ዘይት።',
    showcaseBatteryName: 'ቦሽ የከባድ ጭነት መኪና ባትሪ 12V 200Ah',
    showcaseBatteryDesc: 'ንዝረትን የሚቋቋም አስተማማኝ እና ዘላቂ የንግድ ተሽከርካሪ ባትሪ።',
    showcaseFilterName: 'ፍሊትጋርድ የዘይትና የነዳጅ ማጣሪያ ስብስብ',
    showcaseFilterDesc: 'የተሽከርካሪዎን የነዳጅ ሲስተም ከብክለት የሚከላከል አስተማማኝ ማጣሪያ።',

    categoryTires: 'ጎማዎችና ዊሎች',
    categoryOil: 'የሞተር ዘይትና ቅባቶች',
    categoryElectrical: 'ኤሌክትሪክና ባትሪዎች',
    categoryFilters: 'ማጣሪያዎችና ጥገና',
    categoryAccessories: 'የተሽከርካሪ መገልገያዎች',
    translateCategoryName: createCategoryTranslator({
      tire: 'ጎማዎችና ዊሎች',
      oil: 'የሞተር ዘይትና ቅባቶች',
      lubricant: 'የሞተር ዘይትና ቅባቶች',
      battery: 'ኤሌክትሪክና ባትሪዎች',
      electric: 'ኤሌክትሪክና ባትሪዎች',
      filter: 'ማጣሪያዎችና ጥገና',
      access: 'የተሽከርካሪ መገልገያዎች',
    }),

    platformUsers: 'የፕላትፎርሙ ተጠቃሚዎች',
    whoIsThisFor: 'ይህ ፕላትፎርም ለማን የተዘጋጀ ነው?',
    vehicleOwnersTitle: 'የተሽከርካሪ ባለቤቶች',
    vehicleOwnersDesc:
      'ተሽከርካሪዎችዎን ይመዝግቡ፣ ብቁ አሽከርካሪዎችን ይመድቡ እና አጠቃላይ ስራዎትን በአንድ ዳሽቦርድ ይቆጣጠሩ።',
    driversTitle: 'ሙያተኛ አሽከርካሪዎች',
    driversDesc:
      'የተመደቡበትን ጉዞ ይመልከቱ፣ የተመደቡበትን መኪና ይወቁ እና ከባለቤቱ ጋር በቀጥታ ይገናኙ።',
    joinAsOwner: 'እንደ ባለቤት ተቀላቀል',
    joinAsDriver: 'እንደ አሽከርካሪ ተቀላቀል',

    movingTogether: 'አብረን ወደፊት። የላቀ አገልግሎት።',
    quickLinks: 'ፈጣን ሊንኮች',
    allRightsReserved: 'ኒጅት የትራንስፖርት ስራዎች አስተዳደር። መብቱ በህግ የተጠበቀ ነው።',
    whatsAppSupport: 'የዋትስአፕ ድጋፍ',

    navDashboard: 'ዳሽቦርድ',
    navUsers: 'ተጠቃሚዎች',
    navVehicles: 'ተሽከርካሪዎች',
    navJobs: 'ስራዎች',
    navTrips: 'ጉዞዎች',
    navProfileRequests: 'የመገለጫ ጥያቄዎች',
    navShopOverview: 'የመደብር እይታ',
    navProducts: 'እቃዎች',
    navCategories: 'ምድቦች',
    navShopOrders: 'የትዕዛዝ ዝርዝር',
    navMyVehicles: 'የኔ ተሽከርካሪዎች',
    navMyAssignment: 'የኔ ምደባ',
    navMyTrips: 'የኔ ጉዞዎች',
    navAutoStore: 'የመኪና እቃዎች መደብር',
    navMyCart: 'የኔ ቅርጫት',
    navMyOrders: 'የኔ ትዕዛዞች',
    navProfile: 'መገለጫ',
    navSignOut: 'ውጣ',
    navSignIn: 'ግባ',
    navHome: 'ዋና ገጽ',
    navLoginToOrder: 'ለማዘዝ ይግቡ',

    storeTitle: 'የመኪና መለዋወጫ እቃዎች መደብር',
    storeSubtitle: 'ጥራት ያላቸው ጎማዎች፣ ዘይቶች፣ ባትሪዎች እና ተጨማሪ እቃዎች ለተሸከርካሪዎ',
    searchPlaceholder: 'ጎማ፣ የሞተር ዘይት፣ ማጣሪያ፣ ባትሪ ይፈልጉ...',
    searchButton: 'ፈልግ',
    allCategories: 'ሁሉም ምድቦች',
    cart: 'ቅርጫት',
    price: 'ዋጋ',
    inStock: 'ክምችት አለ',
    leftInStock: 'የቀረ ክምችት',
    soldOut: 'አልቋል',
    outOfStock: 'ክምችት የለም',
    addToCart: 'ወደ ቅርጫት ጨምር',
    addedToCart: 'ተጨምሯል ✓',
    viewDetails: 'ዝርዝር እይ',
    orderNow: 'እዘዝ',
    noProductsFound: 'ምንም እቃ አልተገኘም',
    noProductsDesc: 'እባክዎ ሌላ ቃል ይፈልጉ ወይም ምድቡን ይቀይሩ።',

    backToStore: 'ወደ መደብር ተመለስ',
    productDescription: 'ዝርዝር መግለጫ',
    quantity: 'ብዛት',
    viewCart: 'ቅርጫት እይ',
    skuLabel: 'የእቃ ኮድ (SKU)',
    maxStockLimit: 'ከፍተኛ',

    shoppingCart: 'የግዢ ቅርጫት',
    cartEmpty: 'ቅርጫትዎ ባዶ ነው',
    cartEmptyDesc: 'መደብሩን በመቃኘት እቃዎችን ወደ ቅርጫትዎ ያስገቡ',
    browseStore: 'መደብሩን ጎብኝ',
    orderSummary: 'የትዕዛዝ ማጠቃለያ',
    checkout: 'ትዕዛዝ አጠናቅቅ',
    checkoutTitle: 'ትዕዛዝ ማጠቃለያ',
    completeOrder: 'የትዕዛዝዎን ዝርዝር ይሙሉ',
    deliveryDetails: 'የመላኪያ መረጃ',
    total: 'አጠቃላይ ድምር',
    subtotal: 'ንዑስ ድምር',
    itemSingular: 'እቃ',
    itemPlural: 'እቃዎች',
    shippingAddress: 'የመላኪያ አድራሻ',
    shippingAddressPlaceholder: 'የመድረሻ ቦታ፣ ተርሚናል ወይም የከተማ አድራሻ ያስገቡ',
    shippingAddressRequired: 'እባክዎ የመላኪያ አድራሻ ያስገቡ።',
    specialInstructions: 'ተጨማሪ ማስታወሻ (አማራጭ)',
    specialInstructionsPlaceholder: 'ለምሳሌ፡ ሲደርሱ ይደውሉ፣ በር ላይ ይተዉ',
    placeOrder: 'ትዕዛዙን ላክ',
    placingOrder: 'ትዕዛዝ በመላክ ላይ...',
    continueShopping: '← ግዢ ቀጥል',
    shopMore: '← ተጨማሪ እቃዎችን እይ',
    orderItems: 'የትዕዛዙ እቃዎች',
    orderSuccess: 'ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል! ወደ ትዕዛዝ ገጽ በመሄድ ላይ...',

    myOrders: 'የኔ ትዕዛዞች',
    orderHistory: 'የትዕዛዝ ታሪክ',
    orderHistoryDesc: 'የትዕዛዝዎን ሁኔታና ጉዞ ይከታተሉ',
    noOrdersYet: 'ምንም ትዕዛዝ የለም',
    noOrdersDesc: 'መደብሩን ጎብኝተው የመጀመሪያ ትዕዛዝዎን ያስገቡ',
    deliveryAddress: 'የመላኪያ አድራሻ',
    orderNotes: 'ማስታወሻ',
    orderTotal: 'የትዕዛዝ ድምር',
    orderDate: 'የታዘዘበት ቀን',
    statusPending: 'በመጠባበቅ ላይ',
    statusConfirmed: 'የጸደቀ',
    statusProcessing: 'በዝግጅት ላይ',
    statusShipped: 'የተላከ',
    statusDelivered: 'የደረሰ',
    statusCancelled: 'የተሰረዘ',
    descPending: 'ትዕዛዙ ደርሷል፣ ማረጋገጫ በመጠባበቅ ላይ ነው',
    descConfirmed: 'ትዕዛዙ በመደብሩ ተረጋግጧል',
    descProcessing: 'እቃዎችዎ ለጭነት በመዘጋጀት ላይ ናቸው',
    descShipped: 'ወደ መድረሻዎ በመጓጓዝ ላይ ነው',
    descDelivered: 'እቃው በተሳካ ሁኔታ ደርሷል',
    descCancelled: 'ይህ ትዕዛዝ ተሰርዟል',
    translateStatus: createStatusTranslator(
      {
        PENDING: 'በመጠባበቅ ላይ',
        CONFIRMED: 'የጸደቀ',
        PROCESSING: 'በዝግጅት ላይ',
        SHIPPED: 'የተላከ',
        DELIVERED: 'የደረሰ',
        CANCELLED: 'የተሰረዘ',
      },
      {
        PENDING: 'ትዕዛዙ ደርሷል፣ ማረጋገጫ በመጠባበቅ ላይ ነው',
        CONFIRMED: 'ትዕዛዙ በመደብሩ ተረጋግጧል',
        PROCESSING: 'እቃዎችዎ ለጭነት በመዘጋጀት ላይ ናቸው',
        SHIPPED: 'ወደ መድረሻዎ በመጓጓዝ ላይ ነው',
        DELIVERED: 'እቃው በተሳካ ሁኔታ ደርሷል',
        CANCELLED: 'ይህ ትዕዛዝ ተሰርዟል',
      }
    ),

    loginTitle: 'ወደ ፖርታል ግባ',
    loginSubtitle: 'መለያዎን እና የተሽከርካሪ ስራዎትን ለማስተዳደር ይግቡ',
    emailOrPhone: 'ኢሜይል ወይም ስልክ ቁጥር',
    emailOrPhonePlaceholder: 'ስም@ምሳሌ.ኮም ወይም +251...',
    password: 'የይለፍ ቃል',
    passwordPlaceholder: '••••••••',
    forgotPassword: 'የይለፍ ቃል ረሱ?',
    signInBtn: 'ግባ',
    noAccount: 'መለያ የለዎትም?',
    createOne: 'አሁን ይመዝገቡ',
    backToHome: 'ወደ ዋና ገጽ ተመለስ',
    registerTitle: 'የኒጅት ፕላትፎርምን ይቀላቀሉ',
    registerSubtitle: 'ዛሬ እንዴት መመዝገብ ይፈልጋሉ?',
    asVehicleOwner: 'የተሽከርካሪ ባለቤት',
    asOwnerDesc: 'ተሽከርካሪዎችዎን ይመዝግቡ፣ አሽከርካሪዎችን ይመድቡ እና ገቢዎትን ይቆጣጠሩ።',
    asDriver: 'ሙያተኛ አሽከርካሪ',
    asDriverDesc: 'ጉዞዎችን ያስተዳድሩ፣ የጭነት ሁኔታዎችን ያሳውቁ እና ግንኙነትዎን ያጠናክሩ።',
    alreadyHaveAccount: 'ቀደም ሲል መለያ አለዎት?',
    loginHere: 'እዚህ ይግቡ',

    adminShopTitle: 'የመደብር አስተዳደር',
    adminShopSubtitle: 'ክምችት፣ ምድቦች፣ እቃዎች እና የደንበኛ ትዕዛዞችን ያስተዳድሩ',
    totalRevenue: 'አጠቃላይ ገቢ',
    totalOrders: 'አጠቃላይ ትዕዛዞች',
    totalProductsCount: 'የእቃዎች ብዛት',
    lowStockAlert: 'ያለቀ ክምችት ማስጠንቀቂያ',
    manageProducts: 'እቃዎችን አስተዳድር',
    manageCategories: 'ምድቦችን አስተዳድር',
    viewAllOrders: 'ሁሉንም ትዕዛዞች እይ',
    addProduct: 'አዲስ እቃ ጨምር',
    addCategory: 'አዲስ ምድብ ጨምር',
    productName: 'የእቃ ስም',
    category: 'ምድብ',
    stock: 'ክምችት',

    askOnWhatsApp: 'በዋትስአፕ ጠይቅ',
    buyViaWhatsApp: 'በዋትስአፕ ይዘዙ / ይጠይቁ',
    chatWithSupport: 'በዋትስአፕ ያነጋግሩን',
    whatsAppInquiryMsg: (name, price, sku) =>
      `ሰላም NIGT! ይህን እቃ መግዛት እፈልጋለሁ፡ *${name}* (ዋጋ፡ ETB ${price.toLocaleString()}${sku ? `, ኮድ፡ ${sku}` : ''})። አሁን ይገኛል?`,
    whatsAppGeneralMsg:
      'ሰላም NIGT! ስለ መኪና መለዋወጫ እቃዎች ጥያቄ ነበረኝ።',
  },

  ar: {
    platformTitle: 'منصة NIGT',
    platformSubtitle: 'إدارة عمليات النقل اللوجستي',
    nigtFleet: 'أسطول NIGT',
    autoStore: 'متجر السيارات',
    about: 'من نحن',
    features: 'المميزات',
    contact: 'اتصل بنا',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    dashboard: 'لوحة التحكم',
    openStore: 'فتح المتجر',
    currency: 'ETB',
    actions: 'الإجراءات',
    cancel: 'إلغاء',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    loading: 'جاري التحميل...',

    heroTitle: 'عمليات النقل',
    heroSubtitle: 'الذكية والحديثة',
    heroDescription:
      'منصة مركزية متكاملة لإدارة أسطول النقل والشاحنات والسائقين والأنشطة اللوجستية — كلها في مكان واحد.',
    getStarted: 'ابدأ الآن',
    accessPortal: 'دخول البوابة',
    safe: 'آمن',
    efficient: 'فعال',
    connected: 'متصل',
    reliable: 'موثوق',
    slide1Caption: 'على الطريق، كل يوم',
    slide1Sub: 'دعم النقل البري لمسافات طويلة في جميع أنحاء البلاد.',
    slide2Caption: 'إدارة الأساطيل الكبرى',
    slide2Sub: 'إدارة مركزية لمئات الشاحنات والمركبات بكل سهولة.',
    slide3Caption: 'سائقون معتمدون وموثوقون',
    slide3Sub: 'كل سائق على المنصة تم فحصه واعتماده رسمياً.',
    slide4Caption: 'نقل NIGT',
    slide4Sub: 'نتحرك معاً. نقدم التميز دائماً.',

    whyNigt: 'لماذا NIGT؟',
    featuresHeadline: 'مصممة للتميز في قطاع النقل',
    feature1Title: 'آمن وموثوق',
    feature1Desc: 'تحقق صارم لجميع السائقين والمركبات لضمان أقصى درجات الأمان في كل رحلة.',
    feature2Title: 'لوجستيات متصلة',
    feature2Desc: 'تتبع الرحلات في الوقت الفعلي يضمن استمرارية العمليات وسلاستها.',
    feature3Title: 'تقارير احترافية',
    feature3Desc: 'لوحات تحكم وتحليلات بيانية شاملة لمالكي الشاحنات والمديرين.',

    marketplaceBadge: 'سوق الأسطول',
    storeHeadline: 'قطع غيار وإكسسوارات السيارات',
    storeSubheadline:
      'إطارات معتمدة، زيوت محركات للشاحنات الثقيلة، فلاتر وبطاريات — يتم إدارتها وتوصيلها مباشرة عبر NIGT.',
    visitFullStore: 'زيارة المتجر بالكامل',
    fastFleetDispatch: 'توصيل مباشر وشحن سريع',
    fastFleetDispatchDesc:
      'اطلب قطع الغيار أو الإطارات أو الزيوت عبر البوابة ليتم شحنها مباشرة عبر شبكة أسطول NIGT.',
    browseFullCatalog: 'تصفح الكتالوج بالكامل',

    showcaseTireName: 'إطار شاحنة ثقيلة بريدجستون 295/80R22.5',
    showcaseTireDesc: 'إطار قطري عالي المتانة مصمم لرحلات النقل الطويلة وقابل لإعادة التلبيس.',
    showcaseOilName: 'زيت محرك توتال إنرجيز روبيا فليت HD 15W-40 (20 لتر)',
    showcaseOilDesc: 'زيت تشحيم معدني عالي الكفاءة لمحركات الديزل للشاحنات التجارية.',
    showcaseBatteryName: 'بطارية بوش للشاحنات الثقيلة 12 فولت 200 أمبير',
    showcaseBatteryDesc: 'بطارية قوية ومقاومة للاهتزاز للمركبات التجارية الثقيلة.',
    showcaseFilterName: 'طقم فلاتر زيت ووقود فليت جارد للشاحنات',
    showcaseFilterDesc: 'كفاءة ترشيح فائقة لحماية أنظمة حقن الوقود عالية الضغط.',

    categoryTires: 'الإطارات والعجلات',
    categoryOil: 'زيوت المحركات ومواد التشحيم',
    categoryElectrical: 'الكهرباء والبطاريات',
    categoryFilters: 'الفلاتر والصيانة',
    categoryAccessories: 'إكسسوارات المركبات',
    translateCategoryName: createCategoryTranslator({
      tire: 'الإطارات والعجلات',
      oil: 'زيوت المحركات ومواد التشحيم',
      lubricant: 'زيوت المحركات ومواد التشحيم',
      battery: 'الكهرباء والبطاريات',
      electric: 'الكهرباء والبطاريات',
      filter: 'الفلاتر والصيانة',
      access: 'إكسسوارات المركبات',
    }),

    platformUsers: 'مستخدمو المنصة',
    whoIsThisFor: 'لمن هذه المنصة؟',
    vehicleOwnersTitle: 'مالكو الشاحنات والمركبات',
    vehicleOwnersDesc:
      'سجل أسطولك، وعين سائقين معتمدين، وتابع شاحناتك وعملياتك التشغيلية من شاشة واحدة.',
    driversTitle: 'السائقون المحترفون',
    driversDesc:
      'تابع الرحلات الموكلة إليك، واعرف تعيينات مركباتك، وتواصل مع مالك الأسطول في الوقت الفعلي.',
    joinAsOwner: 'الانضمام كمالك شاحنة',
    joinAsDriver: 'الانضمام كسائق محترف',

    movingTogether: 'نتحرك معاً. نقدم التميز.',
    quickLinks: 'روابط سريعة',
    allRightsReserved: 'إدارة عمليات النقل NIGT. جميع الحقوق محفوظة.',
    whatsAppSupport: 'دعم واتساب',

    navDashboard: 'لوحة التحكم',
    navUsers: 'المستخدمون',
    navVehicles: 'المركبات',
    navJobs: 'المهام',
    navTrips: 'الرحلات',
    navProfileRequests: 'طلبات التعديل',
    navShopOverview: 'نظرة عامة على المتجر',
    navProducts: 'المنتجات',
    navCategories: 'الفئات',
    navShopOrders: 'طلبات المتجر',
    navMyVehicles: 'مركباتي',
    navMyAssignment: 'مركبتي المخصصة',
    navMyTrips: 'رحلاتي',
    navAutoStore: 'متجر السيارات',
    navMyCart: 'سلتي',
    navMyOrders: 'طلباتي',
    navProfile: 'الملف الشخصي',
    navSignOut: 'تسجيل الخروج',
    navSignIn: 'تسجيل الدخول',
    navHome: 'الصفحة الرئيسية',
    navLoginToOrder: 'سجل الدخول للطلب',

    storeTitle: 'متجر قطع غيار وإكسسوارات السيارات',
    storeSubtitle: 'إطارات معتمدة، زيوت محركات، بطاريات، وإكسسوارات لأسطول النقل الخاص بك',
    searchPlaceholder: 'ابحث عن إطارات، زيت محرك، فلاتر، بطاريات...',
    searchButton: 'بحث',
    allCategories: 'جميع الفئات',
    cart: 'السلة',
    price: 'السعر',
    inStock: 'متوفر في المخزن',
    leftInStock: 'متبقي في المخزن',
    soldOut: 'نفد المخزون',
    outOfStock: 'غير متوفر',
    addToCart: 'أضف إلى السلة',
    addedToCart: 'تمت الإضافة ✓',
    viewDetails: 'عرض التفاصيل',
    orderNow: 'اطلب الآن',
    noProductsFound: 'لم يتم العثور على منتجات',
    noProductsDesc: 'يرجى تجربة كلمات بحث مختلفة أو تغيير الفئة.',

    backToStore: 'العودة للمتجر',
    productDescription: 'الوصف',
    quantity: 'الكمية',
    viewCart: 'عرض السلة',
    skuLabel: 'رمز المنتج (SKU)',
    maxStockLimit: 'الحد الأقصى',

    shoppingCart: 'سلة المشتريات',
    cartEmpty: 'السلة فارغة',
    cartEmptyDesc: 'تصفح المتجر وأضف المنتجات المطلوبة إلى سلتك',
    browseStore: 'تصفح المتجر',
    orderSummary: 'ملخص الطلب',
    checkout: 'إتمام الشراء',
    checkoutTitle: 'إتمام الطلب',
    completeOrder: 'أكمل بيانات طلب قطع الغيار',
    deliveryDetails: 'بيانات التسليم والشحن',
    total: 'المجموع الكلي',
    subtotal: 'المجموع الفرعي',
    itemSingular: 'منتج',
    itemPlural: 'منتجات',
    shippingAddress: 'عنوان الشحن / التسليم',
    shippingAddressPlaceholder: 'أدخل موقع التسليم، المحطة، أو عنوان الشارع بالتفصيل',
    shippingAddressRequired: 'يرجى إدخال عنوان التسليم.',
    specialInstructions: 'ملاحظات التسليم (اختياري)',
    specialInstructionsPlaceholder: 'مثال: يرجى الاتصال قبل الوصول، ترك الشحنة عند البوابة...',
    placeOrder: 'تأكيد الطلب',
    placingOrder: 'جاري إرسال الطلب...',
    continueShopping: '← متابعة التسوق',
    shopMore: '← تصفح المزيد من القطع',
    orderItems: 'المنتجات المطلوبة',
    orderSuccess: 'تم إرسال الطلب بنجاح! جاري التحويل...',

    myOrders: 'طلباتي',
    orderHistory: 'سجل الطلبات',
    orderHistoryDesc: 'تتبع حالة طلبات قطع الغيار والإكسسوارات',
    noOrdersYet: 'لا توجد طلبات بعد',
    noOrdersDesc: 'تصفح المتجر وقم بإنشاء طلبك الأول',
    deliveryAddress: 'عنوان التسليم',
    orderNotes: 'الملاحظات',
    orderTotal: 'إجمالي الطلب',
    orderDate: 'تاريخ الطلب',
    statusPending: 'قيد الانتظار',
    statusConfirmed: 'تم التأكيد',
    statusProcessing: 'قيد التجهيز',
    statusShipped: 'تم الشحن',
    statusDelivered: 'تم التسليم',
    statusCancelled: 'ملغي',
    descPending: 'تم استلام الطلب، بانتظار التأكيد',
    descConfirmed: 'تم تأكيد الطلب من قبل المتجر',
    descProcessing: 'جاري تجهيز طلبك للشحن',
    descShipped: 'في الطريق إلى موقع التسليم',
    descDelivered: 'تم تسليم الطلب بنجاح',
    descCancelled: 'تم إلغاء هذا الطلب',
    translateStatus: createStatusTranslator(
      {
        PENDING: 'قيد الانتظار',
        CONFIRMED: 'تم التأكيد',
        PROCESSING: 'قيد التجهيز',
        SHIPPED: 'تم الشحن',
        DELIVERED: 'تم التسليم',
        CANCELLED: 'ملغي',
      },
      {
        PENDING: 'تم استلام الطلب، بانتظار التأكيد',
        CONFIRMED: 'تم تأكيد الطلب من قبل المتجر',
        PROCESSING: 'جاري تجهيز طلبك للشحن',
        SHIPPED: 'في الطريق إلى موقع التسليم',
        DELIVERED: 'تم تسليم الطلب بنجاح',
        CANCELLED: 'تم إلغاء هذا الطلب',
      }
    ),

    loginTitle: 'دخول البوابة',
    loginSubtitle: 'سجل الدخول لإدارة حسابك وعمليات أسطولك',
    emailOrPhone: 'البريد الإلكتروني أو رقم الهاتف',
    emailOrPhonePlaceholder: 'name@example.com أو +251...',
    password: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    forgotPassword: 'نسيت كلمة المرور؟',
    signInBtn: 'تسجيل الدخول',
    noAccount: 'ليس لديك حساب؟',
    createOne: 'أنشئ حساباً جديداً',
    backToHome: 'العودة للصفحة الرئيسية',
    registerTitle: 'الانضمام لمنصة NIGT',
    registerSubtitle: 'كيف ترغب في التسجيل اليوم؟',
    asVehicleOwner: 'مالك شاحنة / مركبة',
    asOwnerDesc: 'سجل أسطولك، وعين سائقين معتمدين، وتتبع أرباح شاحناتك.',
    asDriver: 'سائق محترف',
    asDriverDesc: 'أدر رحلاتك، وأبلغ عن حالات الشحن، وابق على تواصل مع مالك الأسطول.',
    alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
    loginHere: 'سجل الدخول هنا',

    adminShopTitle: 'إدارة المتجر',
    adminShopSubtitle: 'إدارة المخزون، الفئات، المنتجات، وطلبات العملاء',
    totalRevenue: 'إجمالي الإيرادات',
    totalOrders: 'إجمالي الطلبات',
    totalProductsCount: 'عدد المنتجات',
    lowStockAlert: 'تنبيهات انخفاض المخزون',
    manageProducts: 'إدارة المنتجات',
    manageCategories: 'إدارة الفئات',
    viewAllOrders: 'عرض جميع الطلبات',
    addProduct: 'إضافة منتج جديد',
    addCategory: 'إضافة فئة جديدة',
    productName: 'اسم المنتج',
    category: 'الفئة',
    stock: 'المخزون',

    askOnWhatsApp: 'استفسر عبر واتساب',
    buyViaWhatsApp: 'شراء / استفسار عبر واتساب',
    chatWithSupport: 'تواصل عبر واتساب',
    whatsAppInquiryMsg: (name, price, sku) =>
      `مرحباً NIGT! أنا مهتم بشراء: *${name}* (السعر: ETB ${price.toLocaleString()}${sku ? `، الرمز: ${sku}` : ''}). هل هو متوفر حالياً للتوصيل؟`,
    whatsAppGeneralMsg:
      'مرحباً فريق NIGT! لدي استفسار بخصوص قطع غيار وإكسسوارات الشاحنات.',
  },
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('nigt_language') as Language;
    if (saved && (saved === 'en' || saved === 'fr' || saved === 'am' || saved === 'ar')) {
      setLanguageState(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nigt_language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
