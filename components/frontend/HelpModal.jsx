"use client";

import { Modal } from "flowbite-react";
import {
  CornerDownLeft,
  Headphones,
  HelpCircle,
  MessageSquare,
  Truck,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function HelpModal() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="flex items-center space-x-1 text-green-950 dark:text-slate-100"
      >
        <HelpCircle />
        <span>Help</span>
      </button>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
          Need Help with Shopping, Talk to our Help Desk
        </Modal.Header>

        <Modal.Body>
          <div className="grid grid-cols-2 gap-6">
            <a
              href="mailto:support@buylogint.com"
              className="flex items-center space-x-2"
            >
              <div className="flex items-center w-10 h-10 bg-lime-100 justify-center rounded-full">
                <Headphones className="w-6 h-6 text-lime-800" />
              </div>
              <span>Email: support@buylogint.com</span>
            </a>

            <Link
              href="/track"
              className="flex items-center space-x-2"
              onClick={() => setOpenModal(false)}
            >
              <div className="flex items-center w-10 h-10 bg-lime-100 justify-center rounded-full">
                <Truck className="w-6 h-6 text-lime-800" />
              </div>
              <span>Track Order</span>
            </Link>

            <a
              href="mailto:support@buylogint.com"
              className="flex items-center space-x-2"
            >
              <div className="flex items-center w-10 h-10 bg-lime-100 justify-center rounded-full">
                <CornerDownLeft className="w-6 h-6 text-lime-800" />
              </div>
              <span>Urgent Request</span>
            </a>

            <a
              href="mailto:support@buylogint.com"
              className="flex items-center space-x-2"
            >
              <div className="flex items-center w-10 h-10 bg-lime-100 justify-center rounded-full">
                <MessageSquare className="w-6 h-6 text-lime-800" />
              </div>
              <span>Contact Us</span>
            </a>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}