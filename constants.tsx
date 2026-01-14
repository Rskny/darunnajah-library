
import React from 'react';
import { Book, Member, Admin } from './types';

export const CATEGORIES = ['Tafsir', 'Hadits', 'Fiqh', 'Sains', 'Sastra', 'Sejarah Islam'];
export const CLASS_CODES = ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6', 'Kelas 7', 'Kelas 8', 'Kelas 9'];
export const MAJORS = ['Tsanawiyah', 'IPA', 'IPS', 'MAK'];
export const SOURCES = ['Pembelian', 'Sumbangan', 'Denda'];

export const INITIAL_BOOKS: Book[] = [
  { 
    id: '1', 
    title: 'Kitab Al-Umm', 
    author: 'Imam Syafi\'i', 
    year: '2015',
    publisher: 'Darul Kutub',
    isbn: '978-602-1234-01', 
    category: 'Fiqh', 
    classCode: 'Kelas 5',
    major: 'MAK',
    stock: 10,
    source: 'Pembelian',
    inputDate: '2024-01-01',
    available: true 
  },
  { 
    id: '2', 
    title: 'Ar-Raheeq Al-Makhtum', 
    author: 'Safiur Rahman Al-Mubarakpuri', 
    year: '2018',
    publisher: 'Ummul Qura',
    isbn: '978-602-1234-02', 
    category: 'Sejarah Islam', 
    stock: 5,
    source: 'Sumbangan',
    inputDate: '2024-01-05',
    available: false 
  }
];

export const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Ahmad Fauzi', nis: '12001', class: '12 IPA 1', joinDate: '2023-01-15', status: 'active' },
  { id: '2', name: 'Zainal Abidin', nis: '12002', class: '11 IPS 2', joinDate: '2023-02-10', status: 'active' },
];

export const INITIAL_ADMINS: Admin[] = [
  { id: '1', name: 'User Abdullah', username: 'abdullah', email: 'abdullah@darunnajah.com', role: 'Super Admin', lastLogin: '2024-05-20 08:30' },
  { id: '2', name: 'Siti Aminah', username: 'siti', email: 'siti@darunnajah.com', role: 'Librarian', lastLogin: '2024-05-20 09:15' },
];

export const Icons = {
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Books: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Exchange: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  History: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Upload: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
};
