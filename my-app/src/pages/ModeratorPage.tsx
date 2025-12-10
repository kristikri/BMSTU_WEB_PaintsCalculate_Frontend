import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import { BreadCrumbs } from "../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS, ROUTES } from "../Routes";
import { useAppSelector } from "../store/hooks";
import { api } from "../api";
import "./ModeratorPage.css";

interface PaintRequest {
  id?: number;
  status?: string;
  creator_login?: string;
  moderator_login?: string;
  date_create?: string;
  dateFinish?: string;
  dateForm?: string;
}

export default function ModeratorPage() {
  const navigate = useNavigate();
  const { isAuthenticated, username, is_moderator } = useAppSelector(
    (s) => s.user
  );

  const [requests, setRequests] = useState<PaintRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [creatorFilter, setCreatorFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!is_moderator) {
      navigate("/profile");
      return;
    }
    loadRequests();
  }, [isAuthenticated, is_moderator, navigate]);

  const loadRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const params: any = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (dateFrom) params["from-date"] = dateFrom;
      if (dateTo) params["to-date"] = dateTo;

      const response = await api.requests.requestsList(params);
      let list = response.data;

      if (creatorFilter.trim()) {
        list = list.filter((r: PaintRequest) =>
          r.creator_login
            ?.toLowerCase()
            .includes(creatorFilter.toLowerCase())
        );
      }

      setRequests(list);
    } catch (err: any) {
      setError(err.response?.data?.description || "Ошибка загрузки заявок");
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id: number, newStatus: string) => {
    try {
      await api.requests.completePaintRequestUpdate(id, { status: newStatus });

      if (newStatus === "completed") {
        alert("Заявка одобрена! Асинхронный расчёт количества краски запущен.");
      } else {
        alert("Заявка отклонена.");
      }

      loadRequests();
    } catch (error: any) {
      setError(error.response?.data?.description || "Ошибка обновления статуса");
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";
    try {
      return new Date(date).toLocaleDateString("ru-RU");
    } catch {
      return "—";
    }
  };

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  return (
    <div className="moderator-page">
      <Header />

      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.CALCULATES, path: ROUTES.CALCULATES },
          { label: "Модератор" },
        ]}
      />

      <main>
        <div className="moderator-header">
          <h1>Панель модератора</h1>
          <p>Модератор: {username}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="moderator-filters">
          <div className="filter-group">
            <label>Статус:</label>
            <select
              className="filter-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Все</option>
              <option value="formed">Сформированы</option>
              <option value="completed">Завершены</option>
              <option value="rejected">Отклонены</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Дата от:</label>
            <input
              type="date"
              className="filter-input"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Дата до:</label>
            <input
              type="date"
              className="filter-input"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Создатель:</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Логин"
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
            />
          </div>

          <button className="btn-refresh" onClick={loadRequests}>
            Обновить
          </button>
        </div>

        {/* TABLE */}
        <div className="moderator-table-container">
          {loading ? (
            <div className="loading">Загрузка…</div>
          ) : filteredRequests.length > 0 ? (
            <table className="moderator-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Создатель</th>
                  <th>Статус</th>
                  <th>Создана</th>
                  <th>Сформирована</th>
                  <th>Завершена</th>
                  <th>Модератор</th>
                  <th>Действия</th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="moderator-row"
                    onClick={() => navigate(`/calculate/${req.id}`)}
                  >
                    <td>#{req.id}</td>
                    <td>{req.creator_login}</td>
                    <td>
                      <span className={`status-badge status-${req.status}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>{formatDate(req.date_create)}</td>
                    <td>{formatDate(req.dateForm)}</td>
                    <td>{formatDate(req.dateFinish)}</td>
                    <td>{req.moderator_login || "—"}</td>

                    <td className="actions-cell">
                      {req.status === "formed" && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModerate(req.id!, "completed");
                            }}
                          >
                            Одобрить
                          </button>

                          <button
                            className="btn-reject"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModerate(req.id!, "rejected");
                            }}
                          >
                            Отклонить
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-requests">
              <p>Заявки не найдены</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
