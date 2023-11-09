/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
  FormControl,
  Form,
} from "./components/ui/form";
import { useNavigate } from "react-router-dom";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "./components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

type SubmitData = {
  file: string;
  format_type: string;
  quality: string;
  compression_preset: string;
};

export default function App(): React.ReactElement {
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [controller, setController] = React.useState<AbortController>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<SubmitData>({
    defaultValues: {
      file: "",
      format_type: "",
      quality: "",
    },
  });

  const onSubmit: SubmitHandler<SubmitData> = async (data) => {
    const controller = new AbortController();
    const formData = new FormData();
    setController(controller);
    setDisabled(false);

    formData.append(
      "file",
      // @ts-ignore
      document.querySelector("input[name='file']").files[0]
    );
    formData.append("format_type", data.format_type);
    formData.append("quality", data.quality);
    formData.append("compression_preset", data.compression_preset);

    setLoading((l) => !l);
    try {
      const response = await fetch("http://localhost:8000/index.php", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      const responseData = await response.json();

      if (responseData.file) {
        const byteCharacters = window.atob(responseData.file);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: `audio/${data.format_type}`,
        });
        const url = URL.createObjectURL(blob);

        return navigate("/success", {
          state: {
            url,
          },
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        // @ts-ignore
        description: e.message,
        action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
      });
    }
    setLoading((l) => !l);
    setDisabled(true);
  };

  return (
    <div className="w-100 h-full p-4 container flex justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <h1>Upload</h1>
          <CardDescription>
            Converta seus clipes de música favoritos em áudio com um click !
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              encType="multipart/form-data"
            >
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="file"
                    defaultValue=""
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Arquivo de vídeo</FormLabel>
                          <FormControl>
                            <Input
                              id="video"
                              type="file"
                              accept="video/*"
                              placeholder="Seu vídeo"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Vídeo para conversão
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name={"format_type"}
                    defaultValue=""
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formato</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger {...field}>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="mp3">MP3</SelectItem>
                              <SelectItem value="wav">WAV</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Formato que você deseja converter
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    defaultValue={""}
                    name={"quality"}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <>
                        <FormItem>
                          <FormLabel>Qualidade</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger id="quality" {...field}>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="51">Péssima</SelectItem>
                                <SelectItem value="45">Horrível</SelectItem>
                                <SelectItem value="34">Ruim</SelectItem>
                                <SelectItem value="23">Normal</SelectItem>
                                <SelectItem value="15">Boa</SelectItem>
                                <SelectItem value="10">Muito Boa</SelectItem>
                                <SelectItem value="0">Ótima</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>Qualidade do áudio</FormDescription>
                          <FormMessage />
                        </FormItem>
                      </>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    defaultValue={""}
                    name={"compression_preset"}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <>
                        <FormItem>
                          <FormLabel>Compressão:</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger {...field}>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="slow">
                                  Muito boa (Mais lento)
                                </SelectItem>
                                <SelectItem value="medium">Normal</SelectItem>
                                <SelectItem value="ultrafast">
                                  Péssima (Mais rápido)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Qualidade de compressão do arquivo final (quanto
                            mais lento melhor)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      </>
                    )}
                  />
                </div>
              </div>
              <CardFooter className="flex justify-between mt-6 p-0">
                <Button
                  variant="outline"
                  disabled={disabled}
                  onClick={() => controller?.abort()}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Converter
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
