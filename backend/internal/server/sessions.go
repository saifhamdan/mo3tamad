package server

import (
	"context"
	"fmt"
	"mo3tamad/model"

	"github.com/go-redis/redis/v8"
	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
)

// get All cached sessions from Redis
func (s *Server) GetCachedSessions() ([]*model.Session, error) {
	ctx := context.Background()
	js, err := s.Cache.Get(ctx, "sessions")
	if err != nil {
		return nil, err
	}

	sessions := []*model.Session{}
	err = json.Unmarshal([]byte(js), &sessions)
	if err != nil {
		return nil, err
	}

	return sessions, nil
}

// store a session in the DB and cache it in Redis
func (s *Server) StoreSession(session *model.Session) error {
	ctx := context.Background()

	tx := s.DB.Begin()
	err := tx.Create(session).Error
	if err != nil {
		return err
	}

	sessions, err := s.GetCachedSessions()
	if err != nil {
		if err == redis.Nil {

			sessions := []*model.Session{}
			sessions = append(sessions, session)
			b, err := json.Marshal(&sessions)
			if err != nil {
				return err
			}

			s.Cache.Set(ctx, "sessions", b, 0)

			return nil
		}
		return err
	}

	sessions = append(sessions, session)

	b, err := json.Marshal(&sessions)
	if err != nil {
		return err
	}

	s.Cache.Set(ctx, "sessions", b, 0)
	tx.Commit()

	return nil
}

// delete a session from the DB and Cache
func (s *Server) DeleteCachedSession(sessionId string) error {
	ctx := context.Background()

	sessions, err := s.GetCachedSessions()
	if err != nil {
		if err == redis.Nil {
			return fmt.Errorf("no sessions")
		}
		return err
	}

	for i := range sessions {
		if sessions[i].SessionId == sessionId {
			tx := s.DB.Begin()
			err := tx.Delete(&sessions[i]).Error
			if err != nil {
				return err
			}
			sessions = append(sessions[:i], sessions[i+1:]...)
			b, err := json.Marshal(&sessions)
			if err != nil {
				tx.Rollback()
				return err
			}
			s.Cache.Set(ctx, "sessions", b, 0)

			tx.Commit()
			return nil
		}
	}
	return fmt.Errorf("not found")
}

// get all active sessions
func (s *Server) GetAllSessions(c *fiber.Ctx) error {
	sessions, err := s.GetCachedSessions()
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseOK(c, sessions)
}

// delete session
func (s *Server) DeleteSession(c *fiber.Ctx) error {
	sessionId := c.Params("session_id")
	if sessionId == "" {
		return s.App.HttpResponseBadQueryParams(c, fmt.Errorf("empty session_id"))
	}

	err := s.DeleteCachedSession(sessionId)
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseNoContent(c)
}
