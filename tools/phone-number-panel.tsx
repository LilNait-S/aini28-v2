/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Country, CountryDropdown } from "@/components/ui/country-dropdown"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PhoneInput } from "@/components/ui/phone-input"
import { cn } from "@/lib/utils"
import { environment, makeBasePath } from "@/services/api/base"
import {
  useCreateNumberToSendMessage,
  useDeleteNumberToSendMessage,
  useGetAllNumbersToSendMessages,
  useUpdateNumberToSendMessage,
} from "@/services/api/number-to-send"
import { Check, Copy, Loader2, Plus, QrCode, Trash } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Manager, Socket } from "socket.io-client"
import { toast } from "sonner"

export default function WhatsappConnection() {
  const socketRef = useRef<Socket | null>(null)
  const socketURL = makeBasePath(environment, false)

  useEffect(() => {
    const manager = new Manager(socketURL, {
      transports: ["websocket"],
    })
    const socket = manager.socket("/")
    socketRef.current = socket

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.connected)
    })

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message)
    })

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason)
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  const {
    data: phoneNumbers,
    loading: loadingGet,
    refetch,
  } = useGetAllNumbersToSendMessages()
  const { createNumber, loading: loadingCreate } =
    useCreateNumberToSendMessage(refetch)
  const { updateNumber, loading: loadingUpdate } =
    useUpdateNumberToSendMessage(refetch)
  const { deleteNumber } = useDeleteNumberToSendMessage(refetch)

  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [nationalNumber, setNationalNumber] = useState<string>("")

  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)

  const handleAddPhoneNumber = async () => {
    if (!nationalNumber) {
      toast.error("Número requerido", {
        description: "Por favor ingresa un número de teléfono.",
      })
      return
    }

    if (
      phoneNumbers?.some(
        (phone) => phone.numberToSendMessage === nationalNumber
      )
    ) {
      toast.error("Número duplicado", {
        description: "Este número ya está en la lista.",
      })
      return
    }

    if (!selectedCountry) {
      toast.error("País requerido", {
        description: "Por favor selecciona un país.",
      })
      return
    }

    const countryCode = selectedCountry.countryCallingCodes[0]
    const formattedCode = countryCode.startsWith("+")
      ? countryCode
      : `+${countryCode}`

    try {
      await createNumber({
        numberToSendMessage: nationalNumber,
        countryCode: formattedCode,
        status: false,
      })

      toast.success("Número agregado correctamente", {
        description: `El número ${formattedCode} ${nationalNumber} ha sido agregado a la lista.`,
      })
    } catch (error) {
      toast.error("Error al agregar número", {
        description: "No se pudo agregar el número. Intenta nuevamente.",
      })
    }
  }

  const activatePhoneNumber = async (id: number) => {
    try {
      await updateNumber({
        id,
        payload: { status: true },
      })

      toast.success("¡Número activado correctamente!", {
        description: "Este número ahora recibirá los mensajes de pedidos.",
      })
    } catch (_) {
      toast.error("No se pudo activar el número", {
        description:
          "Ocurrió un error al activar el número. Por favor, verifica tu conexión e intenta nuevamente.",
      })
    }
  }

  const handleOpenQrScanner = () => {
    setIsQrScannerOpen(true)
    setScanResult(null)
  }

  const handleStartScanning = () => {
    setIsScanning(true)

    // Simulamos el escaneo con un temporizador
    setTimeout(() => {
      setIsScanning(false)
      // Resultado simulado del escaneo de QR
      setScanResult("PROMO-DESCUENTO-20-MAYO2025")

      toast.success("QR Escaneado")
    }, 3000)
  }

  const handleQrResult = () => {
    setIsQrScannerOpen(false)

    toast.success(
      "Promoción aplicada Se ha aplicado el código de descuento a tu cuenta"
    )
  }

  const activeNumber = phoneNumbers?.find((number) => number.status === true)

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>WhatsApp para Pedidos</CardTitle>
            <CardDescription>
              Ingresa y selecciona el número de WhatsApp que recibirá los
              mensajes de las órdenes de la tienda.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex space-x-2">
            <div className="flex items-center w-full">
              <CountryDropdown
                onChange={(country) => {
                  setSelectedCountry(country)
                  const countryCode = country.countryCallingCodes[0]
                  const formattedCode = countryCode.startsWith("+")
                    ? countryCode
                    : `+${countryCode}`
                  setPhoneNumber(formattedCode)
                }}
                defaultValue={selectedCountry?.alpha3}
                inline
              />
              <PhoneInput
                value={phoneNumber}
                placeholder="Ej: +51987654321"
                defaultCountry={selectedCountry?.alpha2}
                onCountryChange={(country) => {
                  setSelectedCountry(country as Country)
                }}
                onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                setNationalNumber={setNationalNumber}
                inline
              />
            </div>
            <Button onClick={handleAddPhoneNumber} disabled={loadingCreate}>
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Números disponibles</h3>
            {loadingGet ? (
              <div className="flex items-center space-x-2 py-4 justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Cargando números...
                </span>
              </div>
            ) : phoneNumbers?.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay números agregados
              </p>
            ) : (
              <ul className="space-y-2">
                {phoneNumbers?.map(
                  ({ id, numberToSendMessage, status, countryCode }) => (
                    <li key={id} className="flex items-center space-x-1 group">
                      <Button
                        variant={status ? "default" : "outline"}
                        className={cn(
                          "flex-1 justify-between !px-4",
                          status &&
                            "bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
                        )}
                        onClick={() => activatePhoneNumber(id)}
                        disabled={loadingCreate || loadingUpdate}
                      >
                        <span>{countryCode + " " + numberToSendMessage}</span>
                        {status && <Check className="h-4 w-4 text-green-600" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="hidden group-hover:inline-flex"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${countryCode} ${numberToSendMessage}`
                          )
                          toast.success("Número copiado", {
                            description: `${countryCode} ${numberToSendMessage} copiado al portapapeles.`,
                          })
                        }}
                        aria-label="Copiar número"
                      >
                        <Copy className="h-4 w-4 text-blue-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="hidden group-hover:inline-flex"
                        onClick={async (e) => {
                          e.stopPropagation()

                          if (status === true) {
                            toast.error(
                              "No se puede eliminar el número activo",
                              {
                                description:
                                  "Debes activar otro número antes de eliminar este.",
                              }
                            )
                            return
                          }

                          try {
                            await deleteNumber(id)
                            toast.success("Número eliminado correctamente", {
                              description: `El número ${countryCode} ${numberToSendMessage} ha sido eliminado.`,
                            })
                          } catch {
                            toast.error("No se pudo eliminar el número", {
                              description:
                                "Ocurrió un error al eliminar el número.",
                            })
                          }
                        }}
                        disabled={loadingCreate || loadingUpdate}
                        aria-label="Eliminar número"
                      >
                        <Trash className="h-4 w-4 stroke-red-600" />
                      </Button>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          {activeNumber && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200  rounded-md">
              <h3 className="font-medium text-green-800 mb-2">
                Número Activo Actual
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-lg font-bold text-green-800">
                    {activeNumber.countryCode +
                      " " +
                      activeNumber.numberToSendMessage}
                  </span>
                </div>
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-green-700 mt-2">
                Este número seleccionado será al que le lleguen los mensajes de
                las órdenes de pedidos
              </p>
            </div>
          )}

          {/* Nueva sección para escanear QR */}
          <div className="mt-8 p-4 bg-primary/10 border border-primary/50 rounded-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-primary">Escanear Código QR</h3>
              <QrCode className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-primary font-medium mb-4">
              Escanea el código QR con la cuenta de WhatsApp que será utilizada
              para enviar los mensajes desde la aplicación.
            </p>
            <Button
              onClick={handleOpenQrScanner}
              className="w-full bg-primary hover:bg-primary/80 text-white"
            >
              Escanear código QR
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal para escanear QR */}
      <Dialog open={isQrScannerOpen} onOpenChange={setIsQrScannerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escanear Código QR</DialogTitle>
            <DialogDescription>
              Apunta tu cámara al código QR para enlazar tu WhatsApp y poder
              enviar mensajes desde la aplicación
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-6">
            {!scanResult ? (
              <>
                <div className="w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 relative">
                  {isScanning ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute w-full h-full">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 animate-scan"></div>
                      </div>
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  ) : (
                    <QrCode className="h-16 w-16 text-gray-400" />
                  )}
                </div>

                <Button
                  onClick={handleStartScanning}
                  disabled={isScanning}
                  className="bg-primary hover:bg-primary/80"
                >
                  {isScanning ? "Escaneando..." : "Iniciar escaneo"}
                </Button>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <h3 className="font-medium text-green-800 mb-1">
                    ¡Código detectado!
                  </h3>
                  <p className="text-sm text-green-700">Código de promoción:</p>
                  <p className="font-mono bg-white p-2 rounded border mt-2">
                    {scanResult}
                  </p>
                </div>
                <Button
                  onClick={handleQrResult}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Aplicar promoción
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0;
          }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  )
}
