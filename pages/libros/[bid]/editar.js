import Link from "next/link";
import { Router, useRouter } from "next/router";
import { useState } from "react";

export async function getServerSideProps({params}){
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${params.bid}`);
  const data = await res.json();

  return {
    props: {
      book: data
    }
  }
}

const BookEdit = ({ book }) => {

  const router = useRouter();
  const [bookName, setBookName] = useState(book.title);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e){
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${book.id}`, {
      method: 'POST',
      headers: {
        accept: 'application/json', 'content-type' : 'application/json',
      },
      body: JSON.stringify({
        title: bookName,
        _method: 'PATCH'
      })
    });

    if (res.ok) {
      setErrors([]);
      setBookName('');
      return router.push('/libros');
    }

    const data = await res.json();
    setErrors(data.errors);
    setSubmitting(false);
    
  }

  return (
    <div>
      <h1>Book Edit</h1>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          onChange={(e)=>setBookName(e.target.value)} 
          value={bookName} 
          disabled={submitting}
        />

        <button 
          disabled={submitting}>
          {submitting ? 'Enviando...' : 'Enviar'}
        </button>

        {errors.title && (
          <span style={{ color: 'red', display:'block' }}>{errors.title}</span>
        )}
      </form>
      <br />
      <Link href="/libros">Books List</Link>
    </div>
  )
}

export default BookEdit;