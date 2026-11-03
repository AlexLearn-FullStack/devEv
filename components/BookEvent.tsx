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
  const [ isLoading, setIsLoading ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const result = await createBooking({eventId, slug, email});

      if (result.success) {
        setSubmitted(true);
      } else {
        console.error('Unable to Book event: ', result.error);
        setErrorMessage(result.message);
      }
    } finally {
      setIsLoading(false);
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

              <button
                type="submit"
                className="button-submit"
                disabled={ isLoading }
              >
                {
                  isLoading
                    ? 'Submitting...'
                    : 'Submit'
                }
              </button>
              {
                errorMessage
                  && <p className="text-sm" role="alert">{ errorMessage }</p>
              }
            </form>
          )
      }
    </div>
  )
}