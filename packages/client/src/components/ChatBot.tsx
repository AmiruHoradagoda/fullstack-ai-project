import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRef } from 'react';

type FormData = {
   prompt: string;
};

export default function ChatBot() {
   const conversationId = useRef(crypto.randomUUID());
   const { register, handleSubmit, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      console.log('Submitted:', prompt);
      const { data } = await axios.post('/api/chat', {
         prompt,
         conversationId: conversationId.current,
      });
      console.log(data);
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         handleSubmit(onSubmit)();
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         onKeyDown={onKeyDown}
         className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
         <textarea
            {...register('prompt', {
               required: true,
               validate: (data) => data.trim().length > 0,
            })}
            className="w-full border-0 focus:outline-0 resize-none"
            placeholder="Ask anything"
            maxLength={1000}
         />
         <Button
            disabled={!formState.isValid}
            className="rounded-full w-9 h-9"
            type="submit"
         >
            <FaArrowUp />
         </Button>
      </form>
   );
}
