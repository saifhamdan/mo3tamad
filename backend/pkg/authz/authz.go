// Developer: Saif Hamdan
package authz

import (
	"github.com/casbin/casbin/v2"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	"gorm.io/gorm"
)

type Authz struct {
	DBadapter *gormadapter.Adapter
	Enforcer  *casbin.CachedEnforcer
}

func NewAuthz(db *gorm.DB) (*Authz, error) {
	a, _ := gormadapter.NewAdapterByDB(db)
	e, err := casbin.NewCachedEnforcer("pkg/authz/model.conf", a)
	if err != nil {
		return nil, err
	}

	return &Authz{
		DBadapter: a,
		Enforcer:  e,
	}, nil
}
