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
import { Checkbox } from "@/components/ui/checkbox";

type SubmitData = {
  file: string;
  format_type: string;
  quality: string;
  bitrate: string;
  chanell: string;
  default_config: boolean;
};

export default function App(): React.ReactElement {
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [controller, setController] = React.useState<AbortController>();
  const navigate = useNavigate();
  const form = useForm<SubmitData>({
    defaultValues: {
      file: "",
      format_type: "",
      quality: "",
      bitrate: ''
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
    formData.append("bitrate", data.bitrate);
    formData.append("chanell", data.chanell);
    // @ts-ignore
    formData.append("default_config", data.default_config);

    const toggleLoading = () => setLoading((l) => !l);

    toggleLoading();

    const response = await fetch("http://192.168.1.5/videoconverter", {
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
    toggleLoading();
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
                                <SelectItem value="9">Péssima</SelectItem>
                                <SelectItem value="6">Normal</SelectItem>
                                <SelectItem value="3">Boa</SelectItem>
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
                    name={"bitrate"}
                    rules={{ required: !form.getValues('default_config') }}
                    render={({ field }) => (
                      <>
                        <FormItem>
                          <FormLabel>Bitrate</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger id="bitrate" {...field}>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="64K">64K</SelectItem>
                                <SelectItem value="128K">128K</SelectItem>
                                <SelectItem value="192K">192K</SelectItem>
                                <SelectItem value="320K">320K</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>Quanto maior, m</FormDescription>
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
                    name={"chanell"}
                    rules={{ required: !form.getValues('default_config') }}
                    render={({ field }) => (
                      <>
                        <FormItem>
                          <FormLabel>Canal</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger id="bitrate" {...field}>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="1">Mono</SelectItem>
                                <SelectItem value="2">Stéreo</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </>
                    )}
                  />
                  <div className="flex flex-col space-y-1.5">
                    <FormField
                      control={form.control}
                      defaultValue={false}
                      name={"default_config"}
                      rules={{ required: false }}
                      render={({ field }) => (
                        <>
                          <FormItem>
                            <FormControl>
                              <Checkbox checked={field.value}
                                onCheckedChange={field.onChange} style={{ margin: "1rem 0.3rem" }} />
                            </FormControl>
                            <FormLabel>Usar configurações recomendadas</FormLabel>
                            <FormMessage />
                          </FormItem>
                        </>
                      )}
                    />
                  </div>
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
