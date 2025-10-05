import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

type Message = {
   content: string;
   role: 'user' | 'bot';
};
export default function ChatBot() {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const conversationId = useRef(crypto.randomUUID());
   const { register, handleSubmit, formState, reset } = useForm<FormData>({
      mode: 'onChange',
   });

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);
      const { data } = await axios.post<ChatResponse>('/api/chat', {
         prompt,
         conversationId: conversationId.current,
      });
      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
      setIsBotTyping(false);
      reset();
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         handleSubmit(onSubmit)();
         reset();
      }
   };

   return (
      <div>
         <div className="flex flex-col gap-3 mb-10">
            {messages.map((message, index) => (
               <p
                  key={index}
                  className={`px-3 py-1 rounded-xl mb-2 ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
               >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </p>
            ))}
            {isBotTyping && (
               <div className="flex gap-1  px-3 py-3 bg-gray-200 rounded-xl self-start">
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
               </div>
            )}
         </div>
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
      </div>
   );
}
