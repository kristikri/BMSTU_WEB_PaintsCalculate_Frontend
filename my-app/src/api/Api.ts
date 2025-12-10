/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApitypesPaintJSON {
  description?: string;
  hiding_power?: number;
  id?: number;
  is_delete?: boolean;
  photo?: string;
  title?: string;
}

export interface ApitypesPaintRequestJSON {
  creator_login?: string;
  dateFinish?: string;
  dateForm?: string;
  id?: number;
  min_layers?: number;
  moderator_login?: string;
  status?: string;
}

export interface ApitypesRequestsPaintJSON {
  area?: number;
  id?: number;
  layers?: number;
  paintID?: number;
  quantity?: number|null;
  requestID?: number;
}

export interface ApitypesStatusJSON {
  status?: string;
}

export interface ApitypesUserJSON {
  id?: string;
  is_moderator?: boolean;
  login?: string;
  password?: string;
}

export interface HandlerAddPaintToRequestData {
  area: number;
  layers: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Paint Service API
 * @version 1.0
 * @license MIT
 * @contact API Support <support@paint.com> (http://localhost)
 *
 * API для управления красками и заявками
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  paint = {
    /**
     * @description Создает новую запись о краске
     *
     * @tags paints
     * @name CreatePaintCreate
     * @summary Создать краску
     * @request POST:/paint/create-paint
     * @secure
     */
    createPaintCreate: (paint: ApitypesPaintJSON, params: RequestParams = {}) =>
      this.request<ApitypesPaintJSON, Record<string, string>>({
        path: `/paint/create-paint`,
        method: "POST",
        body: paint,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о конкретной краске
     *
     * @tags paints
     * @name PaintDetail
     * @summary Получить краску по ID
     * @request GET:/paint/{id}
     */
    paintDetail: (id: number, params: RequestParams = {}) =>
      this.request<ApitypesPaintJSON, Record<string, string>>({
        path: `/paint/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет краску в текущую заявку-черновик пользователя
     *
     * @tags paints
     * @name AddToCreate
     * @summary Добавить краску в заявку
     * @request POST:/paint/{id}/add-to
     * @secure
     */
    addToCreate: (
      id: number,
      paintData: HandlerAddPaintToRequestData,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesPaintRequestJSON, Record<string, string>>({
        path: `/paint/${id}/add-to`,
        method: "POST",
        body: paintData,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет данные о краске
     *
     * @tags paints
     * @name ChangePaintUpdate
     * @summary Изменить краску
     * @request PUT:/paint/{id}/change-paint
     * @secure
     */
    changePaintUpdate: (
      id: number,
      paint: ApitypesPaintJSON,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesPaintJSON, Record<string, string>>({
        path: `/paint/${id}/change-paint`,
        method: "PUT",
        body: paint,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Помечает краску как удаленную
     *
     * @tags paints
     * @name DeletePaintDelete
     * @summary Удалить краску
     * @request DELETE:/paint/{id}/delete-paint
     * @secure
     */
    deletePaintDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/paint/${id}/delete-paint`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Загружает изображение для конкретной краски
     *
     * @tags paints
     * @name UploadImageCreate
     * @summary Загрузить изображение краски
     * @request POST:/paint/{id}/upload-image
     * @secure
     */
    uploadImageCreate: (
      id: number,
      data: {
        /** Изображение краски */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/paint/${id}/upload-image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  paints = {
    /**
     * @description Возвращает список всех красок или фильтрует по названию
     *
     * @tags paints
     * @name PaintsList
     * @summary Получить список красок
     * @request GET:/paints
     */
    paintsList: (
      query?: {
        /** Фильтр по названию */
        title?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApitypesPaintJSON[], Record<string, string>>({
        path: `/paints`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  requestPaints = {
    /**
 * @description Обновляет данные краски в заявке (площадь, слои), кол-во считается асинхронно
 *
 * @tags request-paints
 * @name RequestPaintsUpdate
 * @summary Изменить параметры краски в заявке
 * @request PUT:/request-paints/{request_id}/{paint_id}
 * @secure
 */
requestPaintsUpdate: (
  requestId: number,
  paintId: number,
  requestPaint: Omit<ApitypesRequestsPaintJSON, "quantity">, // quantity больше не отправляем
  params: RequestParams = {},
) =>
  this.request<
    { message: string; status: string }, // ожидаем ответ сервера
    Record<string, string>
  >({
    path: `/request-paints/${requestId}/${paintId}`,
    method: "PUT",
    body: requestPaint,
    secure: true,
    type: ContentType.Json,
    format: "json",
    ...params,
  }),


    /**
     * @description Удаляет краску из указанной заявки
     *
     * @tags request-paints
     * @name RequestPaintsDelete
     * @summary Удалить краску из заявки
     * @request DELETE:/request-paints/{request_id}/{paint_id}
     * @secure
     */
    requestPaintsDelete: (
      requestId: number,
      paintId: number,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesPaintRequestJSON, Record<string, string>>({
        path: `/request-paints/${requestId}/${paintId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  requests = {
    /**
     * @description Возвращает список заявок с фильтрацией по дате и статусу
     *
     * @tags requests
     * @name RequestsList
     * @summary Получить список заявок
     * @request GET:/requests
     * @secure
     */
    requestsList: (
      query?: {
        /** Начальная дата (YYYY-MM-DD) */
        "from-date"?: string;
        /** Конечная дата (YYYY-MM-DD) */
        "to-date"?: string;
        /** Статус заявки */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApitypesPaintRequestJSON[], Record<string, string>>({
        path: `/requests`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о текущей корзине заявки пользователя
     *
     * @tags requests
     * @name PaintsCalculateList
     * @summary Получить корзину заявки
     * @request GET:/requests/paints-calculate
     * @secure
     */
    paintsCalculateList: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/requests/paints-calculate`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает детальную информацию о заявке
     *
     * @tags requests
     * @name RequestsDetail
     * @summary Получить заявку
     * @request GET:/requests/{id}
     * @secure
     */
    requestsDetail: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/requests/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет данные заявки
     *
     * @tags requests
     * @name ChangePaintRequestUpdate
     * @summary Изменить заявку
     * @request PUT:/requests/{id}/change-paint_request
     * @secure
     */
    changePaintRequestUpdate: (
      id: number,
      request: ApitypesPaintRequestJSON,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesPaintRequestJSON, Record<string, string>>({
        path: `/requests/${id}/change-paint_request`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Завершает или отклоняет заявку (только для модераторов)
     *
     * @tags requests
     * @name CompletePaintRequestUpdate
     * @summary Модерировать заявку
     * @request PUT:/requests/{id}/complete-paint_request
     * @secure
     */
    completePaintRequestUpdate: (
      id: number,
      status: ApitypesStatusJSON,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesPaintRequestJSON, Record<string, string>>({
        path: `/requests/${id}/complete-paint_request`,
        method: "PUT",
        body: status,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Переводит заявку в статус "удалён"
     *
     * @tags requests
     * @name DeletePaintRequestDelete
     * @summary Удалить заявку
     * @request DELETE:/requests/{id}/delete-paint_request
     * @secure
     */
    deletePaintRequestDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/requests/${id}/delete-paint_request`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Переводит заявку из черновика в статус "сформирована"
     *
     * @tags requests
     * @name FormPaintRequestUpdate
     * @summary Сформировать заявку
     * @request PUT:/requests/{id}/form-paint_request
     * @secure
     */
    formPaintRequestUpdate: (id: number, params: RequestParams = {}) =>
      this.request<ApitypesPaintRequestJSON, Record<string, string>>({
        path: `/requests/${id}/form-paint_request`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),
      
    updatePaintQuantity: (
      requestId: number,
      data: { paint_id: number; quantity: number },
      params: RequestParams = {},
      ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/requests/${requestId}/paint_quantity`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

  };
  users = {
    /**
     * @description Получить данные текущего пользователя
     *
     * @tags users
     * @name ProfileList
     * @summary Получить профиль
     * @request GET:/users/profile
     * @secure
     */
    profileList: (params: RequestParams = {}) =>
      this.request<ApitypesUserJSON, Record<string, string>>({
        path: `/users/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновить данные текущего пользователя
     *
     * @tags users
     * @name ProfileUpdate
     * @summary Изменить профиль
     * @request PUT:/users/profile
     * @secure
     */
    profileUpdate: (user: ApitypesUserJSON, params: RequestParams = {}) =>
      this.request<ApitypesUserJSON, Record<string, string>>({
        path: `/users/profile`,
        method: "PUT",
        body: user,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Регистрирует нового пользователя
     *
     * @tags users
     * @name RegisterCreate
     * @summary Регистрация пользователя
     * @request POST:/users/register
     */
    registerCreate: (user: ApitypesUserJSON, params: RequestParams = {}) =>
      this.request<ApitypesUserJSON, Record<string, string>>({
        path: `/users/register`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Аутентификация пользователя и получение JWT токена
     *
     * @tags users
     * @name SigninCreate
     * @summary Вход в систему
     * @request POST:/users/signin
     */
    signinCreate: (credentials: ApitypesUserJSON, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/users/signin`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет токен в черный список
     *
     * @tags users
     * @name SignoutCreate
     * @summary Выход из системы
     * @request POST:/users/signout
     * @secure
     */
    signoutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/users/signout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
