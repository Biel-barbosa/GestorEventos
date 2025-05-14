
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Event, EventCategory } from "@/types";
import { categoryOptions } from "@/services/mockData";
import { toast } from "sonner";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  allDay: z.boolean().default(false),
  start: z.date(),
  end: z.date(),
  category: z.enum(["personal", "work", "social", "other"] as const),
}).refine((data) => {
  // Validação para garantir que a data final não é anterior à data inicial
  return data.end >= data.start;
}, {
  message: "A data final não pode ser anterior à data inicial",
  path: ["end"], // Mostra a mensagem de erro no campo de data final
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: EventFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  // Initialize the form with default values or initial data
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          start: new Date(initialData.start),
          end: new Date(initialData.end),
        }
      : {
          title: "",
          description: "",
          location: "",
          allDay: false,
          start: new Date(),
          end: new Date(new Date().setHours(new Date().getHours() + 1)),
          category: "personal" as EventCategory,
        },
  });

  // Efeito para atualizar a data final quando a data inicial muda
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "start") {
        const startDate = value.start as Date;
        const endDate = form.getValues("end");
        
        // Se a data final for anterior à data inicial, atualize-a
        if (startDate && endDate && endDate < startDate) {
          // Se for evento de dia inteiro, define o mesmo dia para início e fim
          if (form.getValues("allDay")) {
            form.setValue("end", new Date(startDate), { shouldValidate: true });
          } else {
            // Para eventos com hora, adiciona 1 hora à data de início
            const newEndDate = new Date(startDate);
            newEndDate.setHours(startDate.getHours() + 1);
            form.setValue("end", newEndDate, { shouldValidate: true });
          }
        }
      }

      // Se mudar para evento de dia inteiro
      if (name === "allDay" && value.allDay) {
        const startDate = form.getValues("start") as Date;
        if (startDate) {
          // Define a data final igual à inicial para eventos de dia inteiro
          form.setValue("end", new Date(startDate), { shouldValidate: true });
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle form submission
  const handleSubmit = (data: EventFormValues) => {
    // Verificação adicional antes de enviar (redundante com o refine do schema, mas por segurança)
    if (data.end < data.start) {
      toast.error("A data final não pode ser anterior à data inicial");
      return;
    }
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titulo do Evento</FormLabel>
              <FormControl>
                <Input placeholder="Adicione o titulo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adicione a descrição"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local</FormLabel>
              <FormControl>
                <Input placeholder="adicione o local" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* All Day Switch */}
        <FormField
          control={form.control}
          name="allDay"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Dia todo</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Start Date/Time */}
        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Começo do evento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Escolha a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {!form.watch("allDay") && (
            <FormItem className="flex-1">
              <FormLabel>Horário inicio</FormLabel>
              <div className="flex items-center">
                <Controller
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <Input
                      type="time"
                      value={format(field.value, "HH:mm")}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(":");
                        const newDate = new Date(field.value);
                        newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                        field.onChange(newDate);
                      }}
                      className="flex-1"
                    />
                  )}
                />
                <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
              </div>
            </FormItem>
          )}
        </div>

        {/* End Date/Time */}
        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Final do evento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        // Verifica se a data selecionada não é anterior à data de início
                        const startDate = form.getValues("start");
                        if (date && startDate) {
                          // Compara apenas as datas, ignorando a hora
                          const startDay = new Date(startDate);
                          startDay.setHours(0, 0, 0, 0);
                          const endDay = new Date(date);
                          endDay.setHours(0, 0, 0, 0);
                          
                          if (endDay < startDay) {
                            toast.warning("A data final não pode ser anterior à data inicial");
                            return;
                          }
                          
                          // Se for evento de dia inteiro, apenas atualize a data
                          if (form.getValues("allDay")) {
                            field.onChange(date);
                          } else {
                            // Se não for evento de dia inteiro, preserve a hora atual
                            const newDate = new Date(date);
                            const currentEnd = new Date(field.value);
                            newDate.setHours(currentEnd.getHours(), currentEnd.getMinutes());
                            field.onChange(newDate);
                          }
                        } else {
                          field.onChange(date);
                        }
                      }}
                      disabled={(date) => {
                        // Desabilita datas anteriores à data de início
                        const startDate = form.getValues("start");
                        if (!startDate) return false;
                        
                        // Compara apenas as datas, ignorando a hora
                        const startDay = new Date(startDate);
                        startDay.setHours(0, 0, 0, 0);
                        const compareDay = new Date(date);
                        compareDay.setHours(0, 0, 0, 0);
                        
                        return compareDay < startDay;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {!form.watch("allDay") && (
            <FormItem className="flex-1">
              <FormLabel>End Time</FormLabel>
              <div className="flex items-center">
                <Controller
                  control={form.control}
                  name="end"
                  render={({ field }) => (
                    <Input
                      type="time"
                      value={format(field.value, "HH:mm")}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(":");
                        const newDate = new Date(field.value);
                        newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                        
                        // Verifica se a nova hora final é válida
                        const startDate = form.getValues("start");
                        if (startDate) {
                          // Para o mesmo dia, a hora final deve ser maior ou igual à hora inicial
                          const isSameDay = 
                            startDate.getFullYear() === newDate.getFullYear() &&
                            startDate.getMonth() === newDate.getMonth() &&
                            startDate.getDate() === newDate.getDate();
                          
                          if (isSameDay && newDate < startDate) {
                            toast.warning("A hora final não pode ser anterior à hora inicial no mesmo dia");
                            // Define a hora final como a hora inicial + 1
                            const adjustedDate = new Date(startDate);
                            adjustedDate.setHours(startDate.getHours() + 1);
                            field.onChange(adjustedDate);
                            return;
                          }
                        }
                        
                        field.onChange(newDate);
                      }}
                      className="flex-1"
                    />
                  )}
                />
                <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
              </div>
            </FormItem>
          )}
        </div>

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
