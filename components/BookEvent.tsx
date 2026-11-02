"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.actions";


interface Props {
  eventId: string;
  slug: string;
}


export default function  BookEvent ({ eventId, slug }: Props ) {
  const [ email, setEmail ] = useState('');
  const [ submitted, setSubmitted ] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success, error } = await createBooking({eventId, slug, email});

    if (success) {
      setSubmitted(true);
    } else {
      console.error('Unable to Book event: ', error);
    }
    
  }
  
  
  return (
    <div id="book-event">
      {
        submitted
          ? (
            <p className="text-sm">Thank you for signing up!</p>
          )
          : (
            <form onSubmit={ handleSubmit }>
              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={ email }
                  required
                  placeholder="Enter your email address"
                  onChange={
                    (e) => setEmail(e.target.value)
                  }
                />
              </div>

              <button type="submit" className="button-submit">Submit</button>
            </form>
          )
      }
    </div>
  )
}