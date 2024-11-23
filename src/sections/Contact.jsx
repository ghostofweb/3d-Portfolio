import React, { useRef, useState } from 'react';
import emailjs from "@emailjs/browser";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
    const formRef = useRef();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = ({ target: { name, value } }) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await emailjs.send(
                'service_68ee6na', // Service ID
                'template_dry1gsh', // Template ID
                {
                    from_name: form.name,
                    to_name: "Sahiljeet",
                    from_email: form.email,
                    to_email: "sahiljeetsinghkalsi@gmail.com",
                    message: form.message,
                },
                "8x0JrTWdD-GpZATXZ" // Public user ID
            )
            
            setLoading(false);
            setForm({ name: '', email: '', message: '' }); // Reset form
            toast.success('Submission Successful', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            setForm({
                name: '',
                email: '',
                message: '',
            })
        } catch (error) {
            setLoading(false);
            toast.error(`Submission Failed: ${error.message || "An unexpected error occurred."}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        }
    };

    return (
        <section className='c-space my-20' id='contact'>
            <div className='relative min-h-screen flex items-center justify-center flex-col'>
                <img src="/assets/terminal.png" alt="terminal background" className='absolute inset-0 min-h-screen hidden xl:block' />
                <div className='contact-container'>
                    <h3 className='head-text  mt-11'>Let's talk</h3>
                    <p className='text-lg text-white-600'>
                        Looking for a skilled Full-Stack Web Developer? I'm available for freelance projects or a full-time role to bring your ideas to life.
                    </p>
                    <form ref={formRef} onSubmit={handleSubmit} className='mt-12 flex flex-col space-y-7'>
                        <label htmlFor="name" className='space-y-3'>
                            <span className='field-label'>Full name</span>
                            <input id="name" type="text" name="name" value={form.name} onChange={handleChange} required className='field-input' placeholder='Name' />
                        </label>
                        <label htmlFor="email" className='space-y-3'>
                            <span className='field-label'>Email</span>
                            <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required className='field-input' placeholder='example@gmail.com' />
                        </label>
                        <label htmlFor="message" className='space-y-3'>
                            <span className='field-label'>Your Message</span>
                            <textarea id="message" name="message" value={form.message} onChange={handleChange} required rows={5} className='field-input' placeholder="Hi, I'm interested in ...." />
                        </label>
                        <button className='field-btn' type='submit' disabled={loading}>
                            {loading ? "Sending..." : "Send Message"}
                            <img src="/assets/arrow-up.png" alt="arrow-up" className='field-btn_arrow' />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
